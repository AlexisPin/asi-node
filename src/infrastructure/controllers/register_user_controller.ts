import { type RegisterUserSchema } from '#domain/schema/register_user_schema';
import type RegisterUserUsecase from '#domain/usecases/register_user_usecase';

export default class RegisterUserController {
  constructor(private usecase: RegisterUserUsecase) { }

  handle(data: RegisterUserSchema) {
    return this.usecase.handle({
      id: data.id,
      login: data.login,
      password: data.pwd,
      account: data.account,
      cardList: data.cardList,
    });
  }
}
