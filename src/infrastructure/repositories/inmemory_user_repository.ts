import type {
  RegisterUserDao,
  RegisterUserDto,
} from '#domain/contracts/repositories/user_repository';
import UserRepository from '#domain/contracts/repositories/user_repository';

export default class InMemoryUserRepository implements UserRepository {
  readonly #users: RegisterUserDao[] = [];

  getAll(): Promise<RegisterUserDao[]> {
    return Promise.resolve(this.#users);
  }
  save(user: RegisterUserDto): Promise<{ id: string }> {
    this.#users.push({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    return Promise.resolve({ id: user.id });
  }
}
