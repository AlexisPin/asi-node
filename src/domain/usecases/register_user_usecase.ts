import { randomUUID } from 'crypto';

import UserRepository from '#domain/contracts/repositories/user_repository';
import type { RegisterUserDto } from '#domain/dto/register_user_dto';

export default class RegisterUserUsecase {
  constructor(private userRepository: UserRepository) { }

  handle(payload: RegisterUserDto): Promise<{ id: string }> {
    return this.userRepository.save({
      id: randomUUID(),
      username: payload.username,
      email: payload.email,
      password: payload.password,
    });
  }
}
