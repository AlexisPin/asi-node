import GetallUserUsecase from '#domain/usecases/getall_user_usecase';
import RegisterUserUsecase from '#domain/usecases/register_user_usecase';
import GetAllUserController from '#infrastructure/controllers/getall_user_controller';
import { RegisterUserController } from '#infrastructure/controllers/register_user_controller';
import { HttpServer } from '#infrastructure/express/server';
import InMemoryUserRepository from '#infrastructure/repositories/inmemory_user_repository';

function main() {
  const port = 3000;
  const inMemoryUserRepository = new InMemoryUserRepository();
  const registerUserUsecase = new RegisterUserUsecase(inMemoryUserRepository);
  const getallUserUsecase = new GetallUserUsecase(inMemoryUserRepository);
  const registerUserController = new RegisterUserController(registerUserUsecase);
  const getAllUserController = new GetAllUserController(getallUserUsecase);

  HttpServer.run(port, registerUserController, getAllUserController);
}

main();
