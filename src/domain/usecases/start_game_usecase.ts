import { CardState, type PlayerDto } from "#domain/contracts/dto/player_dto";
import type GameRepository from "#domain/contracts/repositories/game_repository";
import { getCards } from "#domain/utils/get_cards";
import type { GameState } from "#infrastructure/socket/type";

export default class StartGameUsecase {
    constructor(private gameRepository: GameRepository) { }

    async handle(game: GameState): Promise<GameState> {
        const PA = 10;
        if ('Waiting' in game) {
            const gameState = game.Waiting;
            const ready = gameState.players.filter(player => player.ready);
            if (ready.length === 2) {
                const players: Record<number, PlayerDto> = {};
                await Promise.all(gameState.players.map(async player => {
                    const cards = (await getCards(player.cards)).map(card => ({
                        ...card,
                        state: CardState.ALIVE,
                    }))
                    players[player.id] = {
                        id: player.id,
                        name: player.name,
                        cards,
                        pa: PA,
                    }
                }))
                const new_game: GameState = {
                    Playing: {
                        state: {
                            id: gameState.game_id,
                            players,
                            turn: Math.random() > 0.5 ? ready[0]!.id : ready[1]!.id,
                        }
                    }
                }
                return this.gameRepository.update_game(gameState.game_id, new_game);
            }
        }
        return game;
    }
}
