import type { Server } from 'socket.io';
import type {
  ClientToServerEvents,
  InterServerEvents,
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
      if (user_id === undefined || Array.isArray(user_id) || Number.isNaN(Number(user_id))) {
        socket.disconnect();
        return;
      }
      const { body } = await findUser(user_id);
      const data = await body.json();
      registerUserController.handle(data);
      socket.on('disconnect', () => {
        deleteUserController.handle(Number(user_id));
      });
    });
  }

  send_chat_message(message: SendMessageDao): Promise<SendMessageDao> {
    this.io.emit('chat_message', message);
    return Promise.resolve(message);
  }

  send(message: string): void {
    this.io.emit('notification', message);
  }
}
