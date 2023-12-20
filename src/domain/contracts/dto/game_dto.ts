import type { PlayerDto } from "./player_dto";

export interface GameDto {
  id: string;
  turn: number;
  players: Record<number, PlayerDto>;
}
