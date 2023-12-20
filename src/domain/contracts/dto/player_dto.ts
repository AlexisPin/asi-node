import type { Card } from "#domain/schema/card_schema";

export interface PlayerDto {
  id: number;
  name: string;
  cards: GameCard[];
  pa: number;
}

export enum CardState {
  ALIVE = 'ALIVE',
  DEAD = 'DEAD',
}

export type GameCard = Card & { state: CardState }
