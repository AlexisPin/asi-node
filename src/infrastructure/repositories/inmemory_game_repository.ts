import type GameRepository from '#domain/contracts/repositories/game_repository';
import type { GameState } from '#infrastructure/socket/type';


export default class InMemoryGameRepository implements GameRepository {
  readonly #rooms: Map<string, GameState> = new Map();
  create_game(game: GameState): Promise<GameState> {
    if ('NotStarted' in game) {
      this.#rooms.set(game.NotStarted.game_id, game);
      return Promise.resolve(game);
    }
    return Promise.reject('Invalid game state');
  }
  update_game(game_id: string, game: GameState): Promise<GameState> {
    this.#rooms.set(game_id, game);
    return Promise.resolve(game);
  }
  get_game(game_id: string): Promise<GameState | undefined> {
    return Promise.resolve(this.#rooms.get(game_id));
  }
}
