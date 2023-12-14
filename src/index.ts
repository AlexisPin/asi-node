import GetallUserUsecase from '#domain/usecases/getall_user_usecase';
import RegisterUserUsecase from '#domain/usecases/register_user_usecase';
import GetAllUserController from '#infrastructure/controllers/getall_user_controller';
import { RegisterUserController } from '#infrastructure/controllers/register_user_controller';
import { HttpServer } from '#infrastructure/express/server';
import InMemoryUserRepository from '#infrastructure/repositories/inmemory_user_repository';
import { Server } from 'socket.io';
import Stompit from './infrastructure/stompit';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '#infrastructure/socket/type';
import DeleteUserController from '#infrastructure/controllers/delete_user_controller';
import DeleteUserUsecase from '#domain/usecases/delete_user_usecase';
import SocketIORepository from '#infrastructure/socket/socket_repository';
import NotificationUsecase from '#domain/usecases/notification_usecase';
import SendMessageUsecase from '#domain/usecases/send_message_usecase';

function main() {
  const PORT = 3000;
  const inMemoryUserRepository = new InMemoryUserRepository();
  const registerUserUsecase = new RegisterUserUsecase(inMemoryUserRepository);
  const getallUserUsecase = new GetallUserUsecase(inMemoryUserRepository);
  const deleteuserUsecase = new DeleteUserUsecase(inMemoryUserRepository);
  const registerUserController = new RegisterUserController(registerUserUsecase);
  const getAllUserController = new GetAllUserController(getallUserUsecase);
  const deleteUserController = new DeleteUserController(deleteuserUsecase);
  const stompitClient = new Stompit();
  stompitClient.connect();

  const expressHttpServer = new HttpServer(registerUserController, getAllUserController);
  const httpServer = expressHttpServer.httpServer;

  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer,
    {
      cors: {
        origin: '*',
      },
    },
  );

  const socketServer = new SocketIORepository(io, registerUserController, deleteUserController);

  const sendMessageUsecase = new SendMessageUsecase(socketServer);
  const notificationService = new NotificationUsecase(sendMessageUsecase, stompitClient);

  expressHttpServer.run(PORT, notificationService);
}

main();
