import type { Server } from 'socket.io';

import SocketRepository, {
  type CreateMessageDto,
} from '#domain/contracts/repositories/socket_repository';
import { registerUserSchema } from '#domain/schema/register_user_schema';
import { generate_id } from '#domain/utils/generate_id';

import { httpClient } from './http_client';
import type {
  ClientToServerEvents,
  NotificationType,
  ServerToClientEvents,
} from './type';
import type UserRepository from '#domain/contracts/repositories/user_repository';
import type CreateGameUsecase from '#domain/usecases/create_game_usecase';

export default class SocketIORepository extends SocketRepository {
  #sockets: Map<number, string> = new Map();
  #users: Map<string, number> = new Map();

  constructor(
    private io: Server<ClientToServerEvents, ServerToClientEvents>,
    userRepository: UserRepository,
    createGameUsecase: CreateGameUsecase,
  ) {
    super();
    io.on('connection', async (socket) => {
      
      socket.on('login', async (id: number) => {
        const response = await httpClient.request({
          method: 'GET',
          path: `/user/${id}`,
        });
  
        const user = registerUserSchema.parse(await response.body.json());
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
        gameRepository.join_game(game_id, {
          id: user_id,
          name
        })
        await socket.join(game_id);
        this.io.to(game_id).emit('update_game_room', 'Choosing')
      });

      socket.on('ready_game_room', async (game_id, cards) => {
        const game = await gameRepository.get_game(game_id);

        this.io.to(game_id).emit('update_game_room', {
          Playing : {
            state : game
          }
        })
      });

      socket.on('request_game_room', async (user_id, name) => {
        const socket_id = this.#sockets.get(user_id);
        if (socket_id) {
          const game = await createGameUsecase.handle({
            id: user_id,
            name
          })
          socket.join(game.id);
          this.io.to(game.id).emit('update_game_room', 'NotStarted')
          this.io.to(socket_id).emit('request_game_room', game.id, name);
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
