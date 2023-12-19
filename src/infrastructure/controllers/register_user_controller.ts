import { type RegisterUserSchema } from '#domain/schema/register_user_schema';
import type RegisterUserUsecase from '#domain/usecases/register_user_usecase';

export default class RegisterUserController {
  constructor(private registerUserUsecase: RegisterUserUsecase) { }

  handle(data: RegisterUserSchema) {
    return this.registerUserUsecase.handle({
      id: data.id,
      login: data.login,
      password: data.pwd,
      account: data.account,
      cardList: data.cardList,
    });
  }
}
