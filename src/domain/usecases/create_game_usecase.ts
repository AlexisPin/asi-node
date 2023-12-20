import type { RegisterPlayerDto } from "#domain/contracts/repositories/game_repository";
import type GameRepository from "#domain/contracts/repositories/game_repository";
import type { GameState } from "#infrastructure/socket/type";
import { randomUUID } from "crypto";

export default class CreateGameUsecase {
  constructor(private gameRepository: GameRepository) { }

  async handle(payload: RegisterPlayerDto): Promise<GameState> {
    const game = {
      NotStarted: {
        game_id: randomUUID(),
        players: [payload],
      }
    }
    return this.gameRepository.create_game(game);
  }
}
