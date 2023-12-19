import type { GameDto } from '#domain/contracts/dto/game_dto';
import type GameRepository from '#domain/contracts/repositories/game_repository';


export default class InMemoryGameRepository implements GameRepository {
  readonly #rooms: GameDto[] = [];

  create_game(game: GameDto): Promise<{ id: string; }> {
    this.#rooms.push(game);
    return Promise.resolve({ id: game.id });
  }

  get_game(id: string): Promise<GameDto | undefined> {
    return Promise.resolve(this.#rooms.find((game) => game.id === id));
  }

  find_game(): Promise<GameDto | undefined> {
    return Promise.resolve(this.#rooms.find((game) => game.vacant));
  }

  delete_game(id: string): Promise<{ deleted: boolean; }> {
    const index = this.#rooms.findIndex((game) => game.id === id);
    if (index === -1) {
      return Promise.reject({ deleted: false });
    }
    this.#rooms.splice(index, 1);
    return Promise.resolve({ deleted: true });
  }

  update_game(game: GameDto): Promise<{ id: string; }> {
    const index = this.#rooms.findIndex((g) => g.id === game.id);
    if (index === -1) {
      return Promise.reject({ id: game.id });
    }
    this.#rooms[index] = game;
    return Promise.resolve({ id: game.id });
  }
}
