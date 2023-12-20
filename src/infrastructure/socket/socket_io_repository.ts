import type { Server } from 'socket.io';

import SocketRepository, {
  type CreateMessageDto,
} from '#domain/contracts/repositories/socket_repository';
import { registerUserSchema } from '#domain/schema/register_user_schema';
import { generate_id } from '#domain/utils/generate_id';
import type DeleteUserController from '#infrastructure/controllers/delete_user_controller';
import type RegisterUserController from '#infrastructure/controllers/register_user_controller';

import { httpClient } from './http_client';
import type {
  ClientToServerEvents,
  NotificationType,
  ServerToClientEvents,
} from './type';

export default class SocketIORepository extends SocketRepository {
  constructor(
    private io: Server<ClientToServerEvents, ServerToClientEvents>,
    registerUserController: RegisterUserController,
    deleteUserController: DeleteUserController,
  ) {
    super();
    io.on('connection', async (socket) => {
      const id = socket.handshake.query['id'];
      if (typeof id !== 'string') {
        socket.disconnect();
        return;
      }
      if (isNaN(Number(id)) && isNaN(parseFloat(id))) {
        socket.disconnect();
        return;
      }

      const user_id = Number(id);
      const response = await httpClient.request({
        method: 'GET',
        path: `/users/${user_id}`,
      });

      const user = registerUserSchema.parse(await response.body.json());

      registerUserController
        .handle(user)
        .then(() => {
          this.send('users_change');
        })
        .catch((error: unknown) => {
          console.log(error);
        });

      socket.on('join_chat_room', async (dest_id: number) => {
        const room = generate_id(user_id, dest_id);
        await socket.join(room);
      });

      socket.on('leave_chat_room', async (dest_id: number) => {
        const room = generate_id(user_id, dest_id);
        await socket.leave(room);
      });

      socket.on('join_game_room', async (game_id: string) => {
        await socket.join(game_id);
      });

      socket.on('leave_game_room', async (game_id: string) => {
        await socket.leave(game_id);
      });

      socket.on('disconnect', () => {
        deleteUserController
          .handle(Number(user_id))
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
