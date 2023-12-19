import type { GameCard } from "#domain/contracts/dto/player_dto";


export class Player {
  id: number;
  name: string;
  cards: GameCard[];
  pa: number;

  constructor(id: number, name: string, cards: GameCard[], pa: number) {
    this.id = id;
    this.name = name;
    this.cards = cards;
    this.pa = pa;
  }
}
