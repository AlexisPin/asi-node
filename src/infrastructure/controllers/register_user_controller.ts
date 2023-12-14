import { registerUserSchema } from '#domain/schema/register_user_schema';
import type RegisterUserUsecase from '#domain/usecases/register_user_usecase';

export default class RegisterUserController {
  constructor(private registerUserUsecase: RegisterUserUsecase) {}

  handle(data: unknown) {
    const body = registerUserSchema.parse(data);

    return this.registerUserUsecase.handle({
      account: body.account,
      cardList: body.cardList,
      id: body.id,
      login: body.login,
      password: body.pwd,
    });
  }
}
