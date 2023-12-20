import type { GameDto } from '#domain/contracts/dto/game_dto';
import type { CreatePlayerGameDto } from '#domain/contracts/repositories/game_repository';
import type GameRepository from '#domain/contracts/repositories/game_repository';


export default class InMemoryGameRepository implements GameRepository {
  readonly #rooms: GameDto[] = [];

  create_game(game: CreatePlayerGameDto): Promise<{ id: string; }> {
    throw new Error('Method not implemented.');
  }

  join_game(game_id: string, player: CreatePlayerGameDto): Promise<{ id: string; }> {
    throw new Error('Method not implemented.');
  }
  update_game(game_id: string, game: GameDto): Promise<GameDto> {
    throw new Error('Method not implemented.');
  }
   
  get_game(game_id: string): Promise<GameDto> {
    throw new Error('Method not implemented.');
  }
}
