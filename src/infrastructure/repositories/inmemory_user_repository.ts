import UserRepository, {
  type CreateUserDto,
  type RegisterUserDao,
} from '#domain/contracts/repositories/user_repository';

export default class InMemoryUserRepository implements UserRepository {
  readonly #users: RegisterUserDao[] = [];

  getAll(): Promise<RegisterUserDao[]> {
    return Promise.resolve(this.#users);
  }
  save(user: CreateUserDto): Promise<{ id: number }> {
    if(this.#users.find((u) => u.id === user.id)) {
      return Promise.reject({ id: user.id });
    }
    this.#users.push({
      id: user.id,
      login: user.login,
      account: user.account,
      cardList: user.cardList,
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
