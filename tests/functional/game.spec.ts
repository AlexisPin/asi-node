
import type { GameDto } from "#domain/contracts/dto/game_dto";
import { CardState } from "#domain/contracts/dto/player_dto";
import type GameRepository from "#domain/contracts/repositories/game_repository";
import CreateGameUsecase from "#domain/usecases/create_game_usecase";
import FindGameUsecase from "#domain/usecases/find_game_usecase";
import { test } from "@japa/runner";


let fakeData = [
  {
    id: '102d316c-906f-4416-94c7-bf6801aeb8c8',
    vacant: true,
    turn: 1,
    players: {
      1: {
        id: 1,
        name: 'player 1',
        cards: [
          {
            id: 1,
            name: 'card 1',
            description: 'description 1',
            affinity: 'affinity 1',
            attack: 10,
            defence: 10,
            energy: 10,
            family: 'family 1',
            hp: 10,
            imgUrl: 'test.com',
            price: 10,
            smallImgUrl: 'test.com',
            userId: 1,
            state: CardState.ALIVE,
          }
        ],
        pa: 10,
      }
    }
  }
] as GameDto[]

class FakeGameRepository implements GameRepository {

  find_game(): Promise<GameDto | undefined> {
    let game = fakeData.find((game) => game.vacant);
    return Promise.resolve(game);
  }

  create_game(game: GameDto): Promise<{ id: string; }> {
    fakeData.push(game);
    return Promise.resolve({ id: game.id });
  }

  update_game(game: GameDto): Promise<{ id: string; }> {
    let index = fakeData.findIndex((g) => g.id === game.id);
    fakeData[index] = game;
    return Promise.resolve({ id: game.id });
  }

  delete_game(id: string): Promise<{ deleted: boolean; }> {
    let index = fakeData.findIndex((g) => g.id === id);
    fakeData.splice(index, 1);
    return Promise.resolve({ deleted: true });
  }

}

test.group('User usecase', (group) => {
  group.each.setup(async () => {

  });

  test('ensure game can be created', async ({ assert }) => {
    const gameRepository = new FakeGameRepository();

    const createGameUsecase = new CreateGameUsecase(gameRepository);

    const data = await createGameUsecase.handle({
      id: 1,
      name: 'test',
      cardList: [],
    });

    assert.properties(data, ["id"])

  });

  test('ensure game can be found', async ({ assert }) => {
    const gameRepository = new FakeGameRepository();

    const findGameUsecase = new FindGameUsecase(gameRepository);

    const data = await findGameUsecase.handle({
      id: 1,
      name: 'test',
      cardList: [],
    });

    assert.properties(data, ["id"])

    assert.deepEqual(data.id, fakeData[0]!.id);

    assert.deepEqual(fakeData[0]!.vacant, false);
  });
});
