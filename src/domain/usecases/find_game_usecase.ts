import type { RegisterPlayerDto } from "#domain/contracts/repositories/game_repository";
import type GameRepository from "#domain/contracts/repositories/game_repository";
import { Game } from "#domain/models/game";
import { Player } from "#domain/models/player";
import { randomUUID } from "crypto";

export default class FindGameUsecase {
  constructor(private gameRepository: GameRepository) { }

  async handle(payload: RegisterPlayerDto): Promise<{ id: string }> {
    const PA = 10;
    // TODO: fetch card list from api
    const player = new Player(payload.id, payload.name, [], PA);
    const game = await this.gameRepository.find_game();
    if (game) {
      const turn = Math.random() > 0.5 ? player.id : game.turn;
      const new_game = new Game(game.id, false, turn, { ...game.players, [player.id]: player });
      return this.gameRepository.update_game(new_game);
    }
    const id = randomUUID();
    const new_game = new Game(id, true, player.id, { [player.id]: player });
    return this.gameRepository.create_game(new_game);
  }
} 
