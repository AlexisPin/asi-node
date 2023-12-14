import type { Server } from 'socket.io';

import SocketRepository, {
  type CreateMessageDto,
} from '#domain/contracts/repositories/socket_repository';
import { generate_id } from '#domain/utils/generate_id';
import type DeleteUserController from '#infrastructure/controllers/delete_user_controller';
import type RegisterUserController from '#infrastructure/controllers/register_user_controller';

import { findUser } from '../undici';
import type {
  ClientToServerEvents,
  InterServerEvents,
  NotificationType,
  ServerToClientEvents,
  SocketData,
} from './type';

export default class SocketIORepository extends SocketRepository {
  constructor(
    private io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
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
      const { body } = await findUser(user_id);
      const data = await body.json();
      registerUserController
        .handle(data)
        .then(() => {
          this.send('users_change');
        })
        .catch((error: unknown) => {
          console.log(error);
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

      socket.on('join_room', async (dest_id: number) => {
        const room = generate_id(user_id, dest_id);
        await socket.join(room);
      });

      socket.on('leave_room', async (dest_id: number) => {
        const room = generate_id(user_id, dest_id);
        await socket.leave(room);
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
