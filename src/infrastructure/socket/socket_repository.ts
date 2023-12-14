import type { Server } from 'socket.io';
import type {
  ClientToServerEvents,
  InterServerEvents,
  NotificationType,
  ServerToClientEvents,
  SocketData,
} from './type';
import SocketRepository, {
  type SendMessageDao,
} from '#domain/contracts/repositories/socket_repository';
import { findUser } from '../undici';
import type { RegisterUserController } from '#infrastructure/controllers/register_user_controller';
import type DeleteUserController from '#infrastructure/controllers/delete_user_controller';

export default class SocketIORepository extends SocketRepository {
  constructor(
    private io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    registerUserController: RegisterUserController,
    deleteUserController: DeleteUserController,
  ) {
    super();
    io.on('connection', async (socket) => {
      const user_id = socket.handshake.query['id'];
      if (
        user_id === undefined ||
        Array.isArray(user_id) ||
        !Number.isSafeInteger(Number(user_id))
      ) {
        socket.disconnect();
        return;
      }
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
        deleteUserController.handle(Number(user_id)).then(() => {
          this.send('users_change');
        });
      });

      socket.on('join_room', (dest_id: number) => {
        const room = [user_id, dest_id].sort().join('_');
        socket.join(room);
      });

      socket.on('leave_room', (dest_id: number) => {
        const room = [user_id, dest_id].sort().join('_');
        socket.leave(room);
      });
    });
  }

  send_chat_message(message: SendMessageDao): Promise<SendMessageDao> {
    this.io.to(message.conversation_id).emit('chat_message', message);
    return Promise.resolve(message);
  }

  send(message: NotificationType): void {
    this.io.emit('notification', message);
  }
}
