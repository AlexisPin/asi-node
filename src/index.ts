import GetallUserUsecase from '#domain/usecases/getall_user_usecase';
import RegisterUserUsecase from '#domain/usecases/register_user_usecase';
import SendChatMessageUsecase from '#domain/usecases/send_chat_message_usecase';
import GetAllUserController from '#infrastructure/controllers/getall_user_controller';
import RegisterUserController from '#infrastructure/controllers/register_user_controller';
import SendChatMessageController from '#infrastructure/controllers/send_chat_message_controller';
import { HttpServer } from '#infrastructure/express/server';
import InMemoryGameRepository from '#infrastructure/repositories/inmemory_game_repository';
import InMemoryUserRepository from '#infrastructure/repositories/inmemory_user_repository';
import SocketIORepository from '#infrastructure/socket/socket_io_repository';


import StompitRepository from './infrastructure/stompit';

const PORT = 3000;

async function main() {
  const expressHttpServer = new HttpServer();

  const inMemoryUserRepository = new InMemoryUserRepository();
  const inMemoryGameRepository = new InMemoryGameRepository();
  const stompitRepository = new StompitRepository();

  const registerUserUsecase = new RegisterUserUsecase(inMemoryUserRepository);
  const registerUserController = new RegisterUserController(registerUserUsecase);

  const getallUserUsecase = new GetallUserUsecase(inMemoryUserRepository);
  const getAllUserController = new GetAllUserController(getallUserUsecase);

  const socketIORepository = new SocketIORepository(
    expressHttpServer.io,
    inMemoryUserRepository,
    inMemoryGameRepository,
  );

  const sendChatMessageUsecase = new SendChatMessageUsecase(stompitRepository, socketIORepository);
  const sendMessageController = new SendChatMessageController(sendChatMessageUsecase);

  await stompitRepository.connect();

  expressHttpServer.run(PORT, registerUserController, getAllUserController, sendMessageController);
}

(async () => {
  await main();
})()
  .then(() => {
    console.log(`Server running at http://localhost:${PORT}`);
  })
  .catch((error) => {
    console.log(error);
  });
