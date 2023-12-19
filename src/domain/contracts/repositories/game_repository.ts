import type { GameDto } from "#domain/contracts/dto/game_dto";

export interface RegisterPlayerDto {
  id: number;
  name: string;
  cardList: number[];
}


export default abstract class GameRepository {
  abstract find_game(): Promise<GameDto | undefined>;
  abstract create_game(game: GameDto): Promise<{id : string}>;
  abstract delete_game(id: string): Promise<{ deleted: boolean }>;
  abstract update_game(game: GameDto): Promise<{id : string}>;
  abstract get_game(id: string): Promise<GameDto | undefined>;
}
