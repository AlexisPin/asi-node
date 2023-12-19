import type { Player } from "./player";


export class Game {
  id: string;
  vacant: boolean;
  turn: number;
  players: Record<number, Player>;

  constructor(id: string, vacant: boolean, turn: number, players: Record<number, Player>) {
    this.id = id;
    this.vacant = vacant;
    this.turn = turn;
    this.players = players;
  }
}
