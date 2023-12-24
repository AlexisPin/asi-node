import BusRepository from '#domain/contracts/repositories/bus_repository';
import CreateGameUsecase from '#domain/usecases/create_game_usecase';
import GetGameUsecase from '#domain/usecases/get_game_usecase';
import GetallUserUsecase from '#domain/usecases/getall_user_usecase';
import JoinGameUsecase from '#domain/usecases/join_game_usecase';
import RegisterUserUsecase from '#domain/usecases/register_user_usecase';
import SendChatMessageUsecase from '#domain/usecases/send_chat_message_usecase';
import SendUpdateUserEndGameUsecase from '#domain/usecases/send_update_user_end_game_usecase';
import StartGameUsecase from '#domain/usecases/start_game_usecase';
import UpdateGameUsecase from '#domain/usecases/update_game_usecase';
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

  const createGameUsecase = new CreateGameUsecase(inMemoryGameRepository);
  const joinGameUsecase = new JoinGameUsecase(inMemoryGameRepository);
  const getGameUsecase = new GetGameUsecase(inMemoryGameRepository);
  const startGameUsecase = new StartGameUsecase(inMemoryGameRepository);
  const updateGameUsecase = new UpdateGameUsecase(inMemoryGameRepository);
  const updateUserEndGame = new SendUpdateUserEndGameUsecase(stompitRepository);

  const socketIORepository = new SocketIORepository(
    expressHttpServer.io,
    inMemoryUserRepository,
    createGameUsecase,
    joinGameUsecase,
    getGameUsecase,
    startGameUsecase,
    updateGameUsecase,
    updateUserEndGame,
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
    console.log({ error });
  });
