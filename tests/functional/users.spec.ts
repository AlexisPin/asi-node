import type { CreateUserDto, RegisterUserDao } from "#domain/contracts/repositories/user_repository";
import type UserRepository from "#domain/contracts/repositories/user_repository";
import RegisterUserUsecase from "#domain/usecases/register_user_usecase";
import { test } from "@japa/runner";


class FakeUserRepository implements UserRepository {
  users: RegisterUserDao[] = [{
    id: 1,
    login: 'test',
    account: 100,
    cardList: [1, 2, 3],
  }];

  save(user: CreateUserDto): Promise<{ id: number }> {
    this.users.push({
      id: user.id,
      login: user.login,
      account: user.account,
      cardList: user.cardList,
    });
    return Promise.resolve({ id: user.id });
  }
  getAll(): Promise<RegisterUserDao[]> {
    return Promise.resolve(this.users);
  }
  delete(id: number): Promise<{ id: number }> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return Promise.reject({ id });
    }
    this.users.splice(index, 1);
    return Promise.resolve({ id });
  }
}

test.group('User usecase', (group) => {
  group.each.setup(async () => {

  });

  test('ensure user can be saved', async ({ assert }) => {
    const fakeUserRepository = new FakeUserRepository();
    const user = {
      id: 2,
      login: 'test2',
      password: 'password',
      account: 100,
      cardList: [1, 2, 3],
    };
    const registerUserUsecase = new RegisterUserUsecase(fakeUserRepository);
    await registerUserUsecase.handle(user);
    const result = fakeUserRepository.users;

    assert.equal(result.length, 2);

    assert.deepEqual(result[1], {
      id: 2,
      login: 'test2',
      account: 100,
      cardList: [1, 2, 3],
    });

  });

  test('ensure user can be retrieved', async ({ assert }) => {
    const fakeUserRepository = new FakeUserRepository();
    const registerUserUsecase = new RegisterUserUsecase(fakeUserRepository);
    await registerUserUsecase.handle({
      id: 2,
      login: 'test2',
      password: 'password',
      account: 100,
      cardList: [1, 2, 3],
    });

    const users = await fakeUserRepository.getAll();

    assert.equal(users.length, 2);

    assert.deepEqual(users[0], {
      id: 1,
      login: 'test',
      account: 100,
      cardList: [1, 2, 3],
    });

    assert.deepEqual(users[1], {
      id: 2,
      login: 'test2',
      account: 100,
      cardList: [1, 2, 3],
    });
  });

  test('ensure user can be deleted', async ({ assert }) => {
    const fakeUserRepository = new FakeUserRepository();
    const registerUserUsecase = new RegisterUserUsecase(fakeUserRepository);
    await registerUserUsecase.handle({
      id: 2,
      login: 'test2',
      password: 'password',
      account: 100,
      cardList: [1, 2, 3],
    });
    const result = await fakeUserRepository.delete(2);
    assert.equal(result.id, 2);

    const users = fakeUserRepository.users;

    assert.equal(users.length, 1);

    assert.deepEqual(users[0], {
      id: 1,
      login: 'test',
      account: 100,
      cardList: [1, 2, 3],
    });
  });
});
