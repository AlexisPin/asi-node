import type { PlayerDto } from "#domain/contracts/dto/player_dto";
import type GameRepository from "#domain/contracts/repositories/game_repository";
import type { GameState } from "#infrastructure/socket/type";

export default class StartGameUsecase {
    constructor(private gameRepository: GameRepository) { }

    async handle(game: GameState): Promise<GameState> {
        const PA = 10;
        if ('Waiting' in game) {
            const gameState = game.Waiting;
            if (gameState.ready.length === 2) {
                const players: Map<number, PlayerDto> = new Map();
                gameState.players.map(player => {
                    players.set(player.id, {
                        id: player.id,
                        name: player.name,
                        cards: [],
                        pa: PA,
                    })
                })
                const new_game: GameState = {
                    Playing: {
                        state: {
                            id: gameState.game_id,
                            players,
                            turn: Math.random() > 0.5 ? gameState.ready[0]! : gameState.ready[1]!,
                        }
                    }
                }
                return this.gameRepository.update_game(gameState.game_id, new_game);
            }
        }
        return game;
    }
}
