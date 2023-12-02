import type { Request } from 'express';

import { registerUserSchema } from '#domain/schema/register_user_schema';
import type RegisterUserUsecase from '#domain/usecases/register_user_usecase';

export class RegisterUserController {
  constructor(private registerUserUsecase: RegisterUserUsecase) {}

  async handle(req: Request<unknown, unknown, Record<string, string>>) {
    const body = registerUserSchema.parse(req.body);

    return this.registerUserUsecase.handle({
      email: body.email,
      password: body.password,
      username: body.username,
    });
  }
}
