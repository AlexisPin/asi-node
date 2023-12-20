import type { GameDto } from '#domain/contracts/dto/game_dto';
import type GameRepository from '#domain/contracts/repositories/game_repository';


export default class InMemoryGameRepository implements GameRepository {
  readonly #rooms: GameDto[] = [];

  create_game(game: GameDto): Promise<{ id: string; }> {
    this.#rooms.push(game);
    return Promise.resolve({ id: game.id });
  }
  update_game(game_id: string, game: GameDto): Promise<GameDto> {
    const index = this.#rooms.findIndex((room) => room.id === game_id);
    if (index === -1) {
      return Promise.reject({ id: game_id });
    }
    this.#rooms[index] = game;
    return Promise.resolve(game);
  }
  get_game(game_id: string): Promise<GameDto | undefined> {
    const game = this.#rooms.find((room) => room.id === game_id);
    return Promise.resolve(game);
  }
}
