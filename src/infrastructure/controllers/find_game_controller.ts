import type { RegisterPlayerDto } from "#domain/contracts/repositories/game_repository";
import type FindGameUsecase from "#domain/usecases/find_game_usecase";


export default class FindGameController {
  constructor(private usecase: FindGameUsecase) { }

  handle(player: RegisterPlayerDto) {
    return this.usecase.handle(player);
  }
}

