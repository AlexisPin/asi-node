import type GameRepository from "#domain/contracts/repositories/game_repository";
import type { GameState } from "#infrastructure/socket/type";

export default class UpdateGameUsecase {
    constructor(private gameRepository: GameRepository) { }

    async handle(game_id: string, payload: GameState): Promise<GameState> {
        const game = await this.gameRepository.get_game(game_id);
        if (game) {
            return this.gameRepository.update_game(game_id, payload);
        }
        return this.gameRepository.create_game(payload)
    }
}

