import type GameRepository from "#domain/contracts/repositories/game_repository";
import type { GameState } from "#infrastructure/socket/type";


export default class GetGameUsecase {
  constructor(private gameRepository: GameRepository) {}

  handle(id: string): Promise<GameState | undefined> {
    return this.gameRepository.get_game(id);    
  }
}
