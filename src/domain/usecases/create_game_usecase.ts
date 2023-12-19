import type { RegisterPlayerDto } from "#domain/contracts/repositories/game_repository";
import type GameRepository from "#domain/contracts/repositories/game_repository";
import type SocketRepository from "#domain/contracts/repositories/socket_repository";
import { Game } from "#domain/models/game";
import { Player } from "#domain/models/player";
import { randomUUID } from "crypto";

export default class CreateGameUsecase {
  constructor(private gameRepository: GameRepository, private socketRepository : SocketRepository) { }

  async handle(payload: RegisterPlayerDto): Promise<{ id: string }> {
    const id = randomUUID();
    const PA = 10;
    // TODO: fetch card list from api
    const player = new Player(payload.id, payload.name, [], PA);
    const game = new Game(id, true, player.id, { [player.id]: player });
    return this.gameRepository.create_game(game);
  }
}
