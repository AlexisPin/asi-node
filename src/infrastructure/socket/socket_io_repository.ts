import type { Server } from 'socket.io';

import SocketRepository, {
  type CreateMessageDto,
} from '#domain/contracts/repositories/socket_repository';
import { generate_id } from '#domain/utils/generate_id';

import type {
  ClientToServerEvents,
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
            password: user.pwd
          })
          .then(() => {
            this.#sockets.set(id, socket.id);
            this.#users.set(socket.id, id);
            this.send('users_change');
          })
          .catch((error: unknown) => {
            console.log(error);
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
          name
        })
        await socket.join(game_id);
        this.io.to(game_id).emit('update_game_room', game)
      });

      socket.on('ready_game_room', async (game_id, user_id, cards) => {
        const game = await getGameUsecase.handle(game_id);
        if (!game) return;
        if ('Choosing' in game) {
          const new_game = {
            Waiting: {
              game_id,
              players: game.Choosing.players.map(player => ({
                id: player.id,
                name: player.name,
                cards: player.id === user_id ? cards : [],
                ready: player.id === user_id ? true : false
              })),
            }
          }
          socket.emit('update_game_room', await updateGameUsecase.handle(game_id, new_game))
          return;
        }
        if ('Waiting' in game) {
          const new_game = {
            Waiting: {
              game_id,
              players: game.Waiting.players.map(player => ({
                id: player.id,
                name: player.name,
                cards: player.id === user_id ? cards : player.cards,
                ready: player.id === user_id ? true : player.ready
              })),
            }
          }
          this.io.to(game_id).emit('update_game_room', await startGameUsecase.handle(new_game))
        }
      });

      socket.on('request_game_room', async (friend_id, name) => {
        const socket_id = this.#sockets.get(friend_id);
        const user_id = this.#users.get(socket.id);
        if (socket_id && user_id) {
          const game = await createGameUsecase.handle({
            id: user_id,
            name
          })
          if ('NotStarted' in game) {
            socket.join(game.NotStarted.game_id);
            this.io.to(game.NotStarted.game_id).emit('update_game_room', {
              NotStarted: {
                game_id: game.NotStarted.game_id,
                players: [{
                  id: user_id,
                  name
                }]
              }
            })
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
            console.log(error);
          });
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
}
