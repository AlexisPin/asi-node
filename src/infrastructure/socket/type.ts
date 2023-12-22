import type { GameDto } from '#domain/contracts/dto/game_dto';
import type { RegisterPlayerDto } from '#domain/contracts/repositories/game_repository';
import type { CreateMessageDto } from '#domain/contracts/repositories/socket_repository';

export interface ServerToClientEvents {
  chat_message: (message: CreateMessageDto) => void;
  notification: (message: NotificationType) => void;
  request_game_room: (game_id: string, name: string) => void;
  update_game_room: (status: GameState) => void;
}

export type NotificationType = 'users_change';

export interface ClientToServerEvents {
  login: (user_id: number) => void;
  join_chat_room: (user_id: number) => void;
  leave_chat_room: (user_id: number) => void;
  join_game_room: (game_id: string, user_id: number, name: string) => void;
  request_game_room: (user_id: number, name: string) => void;
  leave_game_room: (game_id: string) => void;
  ready_game_room: (game_id: string, user_id: number, cards: number[]) => void;
  attack: (game_id: string, target: number, card: number) => void;
  end_turn: (game_id: string,) => void;
}


export type GameState =
  | {
    NotStarted: {
      game_id: string;
      players: RegisterPlayerDto[];
    }
  }
  | {
    Choosing: {
      game_id: string;
      players: RegisterPlayerDto[];
    }
  }
  | {
    Waiting: {
      game_id: string;
      players: {
        id: number;
        name: string;
        cards: number[];
        ready: boolean;
      }[];
    }
  }
  | {
    Playing: {
      state: GameDto;
    };
  }
  | {
    Finished: {
      winner: number;
      loser: number;
    };
  };
