import type { CreatePlayerDto } from "./player_dto";

export interface GameDto {
  id: string;
  vacant: boolean;
  turn: number;
  players: Record<number, CreatePlayerDto>;
}
