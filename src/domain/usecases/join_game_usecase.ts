import type { RegisterPlayerDto } from "#domain/contracts/repositories/game_repository";
import type GameRepository from "#domain/contracts/repositories/game_repository";
import type { GameState } from "#infrastructure/socket/type";

export default class JoinGameUsecase {
  constructor(private gameRepository: GameRepository) { }

  async handle(game_id: string, payload: RegisterPlayerDto): Promise<GameState> {
    const game = await this.gameRepository.get_game(game_id);
    if (game) {
      if ('NotStarted' in game) {
        const players = game.NotStarted.players;
        const new_game = {
          Choosing: {
            game_id,
            players: [...players, payload],
          }
        }
        return this.gameRepository.update_game(game_id, new_game);
      }
      return game;
    }
    const new_game = {
      NotStarted: {
        game_id,
        players: [payload],
      }
    }
    return this.gameRepository.create_game(new_game)
  }
} 
