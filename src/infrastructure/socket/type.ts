import type { GameDto } from '#domain/contracts/dto/game_dto';
import type { CreateMessageDto } from '#domain/contracts/repositories/socket_repository';

export interface ServerToClientEvents {
  chat_message: (message: CreateMessageDto) => void;
  notification: (message: NotificationType) => void;
  request_game_room: (game_id: string, name: string) => void;
  update_game_room: (status: GameStatus) => void;
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
}


export type GameStatus =
  | "NotStarted"
  | "Choosing"
  | "Waiting"
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