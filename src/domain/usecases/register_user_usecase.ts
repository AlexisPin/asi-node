import UserRepository from '#domain/contracts/repositories/user_repository';
import type { RegisterUserDto } from '#domain/dto/register_user_dto';

export default class RegisterUserUsecase {
  constructor(private userRepository: UserRepository) {}

  handle(payload: RegisterUserDto): Promise<{ id: number }> {
    return this.userRepository.save(payload);
  }
}
