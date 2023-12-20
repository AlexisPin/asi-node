import type { GameDto } from "#domain/contracts/dto/game_dto";
import type GameRepository from "#domain/contracts/repositories/game_repository";


export default class GetGameUsecase {
  constructor(private gameRepository: GameRepository) {}

  handle(id: string): Promise<GameDto | undefined> {
    return this.gameRepository.get_game(id);    
  }
}
