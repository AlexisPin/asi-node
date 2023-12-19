import CreateGameUsecase from '#domain/usecases/create_game_usecase';
import DeleteUserUsecase from '#domain/usecases/delete_user_usecase';
import FindGameUsecase from '#domain/usecases/find_game_usecase';
import GetallUserUsecase from '#domain/usecases/getall_user_usecase';
import RegisterUserUsecase from '#domain/usecases/register_user_usecase';
import SendChatMessageUsecase from '#domain/usecases/send_chat_message_usecase';
import CreateGameController from '#infrastructure/controllers/create_game_controller';
import DeleteUserController from '#infrastructure/controllers/delete_user_controller';
import FindGameController from '#infrastructure/controllers/find_game_controller';
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

  const deleteuserUsecase = new DeleteUserUsecase(inMemoryUserRepository);
  const deleteUserController = new DeleteUserController(deleteuserUsecase);

  const socketIORepository = new SocketIORepository(
    expressHttpServer.io,
    registerUserController,
    deleteUserController,
  );

  const sendChatMessageUsecase = new SendChatMessageUsecase(stompitRepository, socketIORepository);
  const sendMessageController = new SendChatMessageController(sendChatMessageUsecase);

  const createGameUsecase = new CreateGameUsecase(inMemoryGameRepository);
  const createGameController = new CreateGameController(createGameUsecase);

  const findGameUsecase = new FindGameUsecase(inMemoryGameRepository);
  const findGameController = new FindGameController(findGameUsecase);

  await stompitRepository.connect();

  expressHttpServer.run(PORT, registerUserController, getAllUserController, sendMessageController, createGameController, findGameController);
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
