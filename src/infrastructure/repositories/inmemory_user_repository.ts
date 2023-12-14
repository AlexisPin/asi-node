import type { RegisterUserDao } from '#domain/contracts/repositories/user_repository';
import UserRepository from '#domain/contracts/repositories/user_repository';
import type { RegisterUserDto } from '#domain/dto/register_user_dto';

export default class InMemoryUserRepository implements UserRepository {
  readonly #users: RegisterUserDao[] = [];

  getAll(): Promise<RegisterUserDao[]> {
    return Promise.resolve(this.#users);
  }
  save(user: RegisterUserDto): Promise<{ id: number }> {
    this.#users.push({
      id: user.id,
      account: user.account,
      cardList: user.cardList,
      login: user.login,
    });
    return Promise.resolve({ id: user.id });
  }

  delete(id: number): Promise<{ id: number }> {
    const index = this.#users.findIndex((user) => user.id === id);
    if (index === -1) {
      return Promise.reject({ id });
    }
    this.#users.splice(index, 1);
    return Promise.resolve({ id });
  }
}
