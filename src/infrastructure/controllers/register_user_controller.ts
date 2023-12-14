import { registerUserSchema } from '#domain/schema/register_user_schema';
import type RegisterUserUsecase from '#domain/usecases/register_user_usecase';

export default class RegisterUserController {
  constructor(private registerUserUsecase: RegisterUserUsecase) {}

  handle(data: unknown) {
    const body = registerUserSchema.parse(data);
    const { account, cardList, id, login, pwd } = body;

    return this.registerUserUsecase.handle({
      account,
      cardList,
      id,
      login,
      password: pwd,
    });
  }
}
