import type { RegisterPlayerDto } from "#domain/contracts/repositories/game_repository";
import type CreateGameUsecase from "#domain/usecases/create_game_usecase";


export default class CreateGameController {
  constructor(private usecase: CreateGameUsecase) { }

  handle(player: RegisterPlayerDto) {
    return this.usecase.handle(player);
  }
}

