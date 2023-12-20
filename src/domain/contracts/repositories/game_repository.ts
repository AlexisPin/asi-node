import type { GameState } from "#infrastructure/socket/type";

export interface RegisterPlayerDto {
  id: number;
  name: string;
}

export default abstract class GameRepository {
  abstract create_game(game: GameState): Promise<GameState>;
  abstract update_game(game_id: string, game: GameState): Promise<GameState>;
  abstract get_game(game_id: string): Promise<GameState | undefined>;
}
