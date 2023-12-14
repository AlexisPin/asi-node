import type { RegisterUserDto } from '#domain/contracts/dto/register_user_dto';
import UserRepository from '#domain/contracts/repositories/user_repository';
import { User } from '#domain/models/user';

export default class RegisterUserUsecase {
  constructor(private userRepository: UserRepository) {}

  handle(payload: RegisterUserDto): Promise<{ id: number }> {
    const { id, login, account, cardList, password } = payload;
    const user = new User(id, login, account, cardList, password);
    return this.userRepository.save(user);
  }
}
