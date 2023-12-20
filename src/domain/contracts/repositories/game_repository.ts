import type { GameDto } from "../dto/game_dto";

export interface RegisterPlayerDto {
  id: number;
  name: string;
}

export default abstract class GameRepository {
  abstract create_game(game: GameDto): Promise<{id : string}>;
  abstract update_game(game_id: string, game: GameDto): Promise<GameDto>;
  abstract get_game(game_id: string): Promise<GameDto | undefined>;
}
