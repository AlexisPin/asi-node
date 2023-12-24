import type { Server } from 'socket.io';

import SocketRepository, {
  type CreateMessageDto,
} from '#domain/contracts/repositories/socket_repository';
import { generate_id } from '#domain/utils/generate_id';

import type {
  ClientToServerEvents,
  GameState,
  NotificationType,
  ServerToClientEvents,
} from './type';
import type UserRepository from '#domain/contracts/repositories/user_repository';
import type CreateGameUsecase from '#domain/usecases/create_game_usecase';
import type JoinGameUsecase from '#domain/usecases/join_game_usecase';
import type GetGameUsecase from '#domain/usecases/get_game_usecase';
import type StartGameUsecase from '#domain/usecases/start_game_usecase';
import type UpdateGameUsecase from '#domain/usecases/update_game_usecase';
import { getUser } from '#domain/utils/get_user';
import { CardState, type GameCard, type PlayerDto } from '#domain/contracts/dto/player_dto';
import type SendUpdateUserEndGameUsecase from '#domain/usecases/send_update_user_end_game_usecase';

export default class SocketIORepository extends SocketRepository {
  #sockets: Map<number, string> = new Map();
  #users: Map<string, number> = new Map();

  constructor(
    private io: Server<ClientToServerEvents, ServerToClientEvents>,
    userRepository: UserRepository,
    createGameUsecase: CreateGameUsecase,
    joinGameUsecase: JoinGameUsecase,
    getGameUsecase: GetGameUsecase,
    startGameUsecase: StartGameUsecase,
    updateGameUsecase: UpdateGameUsecase,
    updateUserEndGame: SendUpdateUserEndGameUsecase,
  ) {
    super();
    io.on('connection', async (socket) => {
      socket.on('login', async (id: number) => {
        const user = await getUser(id);
        userRepository
          .save({
            account: user.account,
            cardList: user.cardList,
            id: user.id,
            login: user.login,
            password: user.pwd,
          })
          .then(() => {
            this.#sockets.set(id, socket.id);
            this.#users.set(socket.id, id);
            this.send('users_change');
          })
          .catch((error: unknown) => {
            console.log({ error });
          });
      });

      socket.on('join_chat_room', async (dest_id: number) => {
        const user_id = this.#users.get(socket.id);
        if (!user_id) return;
        const room = generate_id(user_id, dest_id);
        await socket.join(room);
      });

      socket.on('leave_chat_room', async (dest_id: number) => {
        const user_id = this.#users.get(socket.id);
        if (!user_id) return;
        const room = generate_id(user_id, dest_id);
        await socket.leave(room);
      });

      socket.on('join_game_room', async (game_id, user_id, name) => {
        const game = await joinGameUsecase.handle(game_id, {
          id: user_id,
          name,
        });
        await socket.join(game_id);
        this.io.to(game_id).emit('update_game_room', game);
      });

      socket.on('ready_game_room', async (game_id, user_id, cards) => {
        const game = await getGameUsecase.handle(game_id);
        if (!game) return;
        if ('Choosing' in game) {
          const new_game = {
            Waiting: {
              game_id,
              players: game.Choosing.players.map((player) => ({
                id: player.id,
                name: player.name,
                cards: player.id === user_id ? cards : [],
                ready: player.id === user_id ? true : false,
              })),
            },
          };
          socket.emit('update_game_room', await updateGameUsecase.handle(game_id, new_game));
          return;
        }
        if ('Waiting' in game) {
          const new_game = {
            Waiting: {
              game_id,
              players: game.Waiting.players.map((player) => ({
                id: player.id,
                name: player.name,
                cards: player.id === user_id ? cards : player.cards,
                ready: player.id === user_id ? true : player.ready,
              })),
            },
          };
          this.io.to(game_id).emit('update_game_room', await startGameUsecase.handle(new_game));
        }
      });

      socket.on('request_game_room', async (friend_id, name) => {
        const socket_id = this.#sockets.get(friend_id);
        const user_id = this.#users.get(socket.id);
        if (socket_id && user_id) {
          const game = await createGameUsecase.handle({
            id: user_id,
            name,
          });
          if ('NotStarted' in game) {
            socket.join(game.NotStarted.game_id);
            this.io.to(game.NotStarted.game_id).emit('update_game_room', {
              NotStarted: {
                game_id: game.NotStarted.game_id,
                players: [
                  {
                    id: user_id,
                    name,
                  },
                ],
              },
            });
            this.io.to(socket_id).emit('request_game_room', game.NotStarted.game_id, name);
          }
        }
      });

      socket.on('leave_game_room', async (game_id: string) => {
        await socket.leave(game_id);
      });

      socket.on('disconnect', () => {
        const user_id = this.#users.get(socket.id);
        if (!user_id) return;
        userRepository
          .delete(user_id)
          .then(() => {
            this.send('users_change');
          })
          .catch((error: unknown) => {
            console.log({ error });
          });
      });

      socket.on('attack', async (game_id, target, card) => {
        const game = await getGameUsecase.handle(game_id);
        if (!game) return;
        if ('Playing' in game) {
          const turn_data = this.extract_players_cards(game, game.Playing.state.turn, card, target);
          if (!turn_data) return;
          const { player, opponent, attack_card, target_card } = turn_data;
          if (player.pa < 1) return;

          if (target_card.state === CardState.DEAD) return;

          const hp_remain = target_card.hp - attack_card.attack;
          if (hp_remain > 0) {
            target_card.hp = hp_remain;
          } else {
            target_card.hp = 0;
            target_card.state = CardState.DEAD;
          }
          if (opponent.cards.every((card) => card.state === CardState.DEAD)) {
            const end_game = {
              Playing: {
                state: {
                  ...game.Playing.state,
                  players: {
                    ...game.Playing.state.players,
                    [player.id]: {
                      ...player,
                      cards: player.cards.map((c) => (c.id === card ? attack_card : c)),
                      pa: player.pa - 1,
                    },
                    [opponent.id]: {
                      ...opponent,
                      cards: opponent.cards.map((c) => (c.id === target ? target_card : c)),
                    },
                  },
                },
              },
              Finished: {
                winner: player.id,
                loser: opponent.id,
              },
            };
            this.io
              .to(game_id)
              .emit('update_game_room', await updateGameUsecase.handle(game_id, end_game));
            const user = await getUser(player.id);
            updateUserEndGame.handle({ ...user, account: user.account + 200 });
          } else {
            const new_game = {
              Playing: {
                state: {
                  ...game.Playing.state,
                  players: {
                    ...game.Playing.state.players,
                    [player.id]: {
                      ...player,
                      cards: player.cards.map((c) => (c.id === card ? attack_card : c)),
                      pa: player.pa - 1,
                    },
                    [opponent.id]: {
                      ...opponent,
                      cards: opponent.cards.map((c) => (c.id === target ? target_card : c)),
                    },
                  },
                },
              },
            };
            this.io
              .to(game_id)
              .emit('update_game_room', await updateGameUsecase.handle(game_id, new_game));
          }
        }
      });

      socket.on('end_turn', async (game_id) => {
        const game = await getGameUsecase.handle(game_id);
        if (!game) return;
        if ('Playing' in game) {
          const user_id = game.Playing.state.turn;
          const current_player = Object.values(game.Playing.state.players).find(
            (player) => player.id === user_id,
          );
          if (!current_player) return;
          const opponent = Object.values(game.Playing.state.players).find(
            (player) => player.id !== user_id,
          );
          if (!opponent) return;
          const turn = opponent.id;
          const new_game = {
            Playing: {
              state: {
                ...game.Playing.state,
                turn,
                players: {
                  ...game.Playing.state.players,
                  [opponent.id]: {
                    ...opponent,
                    pa: opponent.pa + 3 > 10 ? 10 : opponent.pa + 3,
                  },
                },
              },
            },
          };
          this.io
            .to(game_id)
            .emit('update_game_room', await updateGameUsecase.handle(game_id, new_game));
        }
      });
    });
  }

  send_chat_message(message: CreateMessageDto): Promise<CreateMessageDto> {
    this.io.to(message.conversation_id).emit('chat_message', message);
    return Promise.resolve(message);
  }

  send(message: NotificationType): void {
    this.io.emit('notification', message);
  }

  extract_players_cards(
    game_state: GameState,
    user_id: number,
    card: number,
    target: number,
  ):
    | { player: PlayerDto; opponent: PlayerDto; attack_card: GameCard; target_card: GameCard }
    | undefined {
    if (!('Playing' in game_state)) return;
    const game = game_state.Playing.state;
    const player = Object.values(game.players).find((player) => player.id === user_id);
    if (!player) return;
    const opponent = Object.values(game.players).find((player) => player.id !== user_id);
    if (!opponent) return;
    const attack_card = player.cards.find((c) => c.id === card);
    const target_card = opponent.cards.find((c) => c.id === target);
    if (!attack_card || !target_card) return;
    return { player, opponent, attack_card, target_card };
  }
}
