import type { PlayerDto } from "./player_dto";

export interface GameDto {
  id: string;
  turn: number;
  players: Map<number, PlayerDto>;
}
