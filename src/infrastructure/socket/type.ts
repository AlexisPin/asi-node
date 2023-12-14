import type { SendMessageDao } from '#domain/contracts/repositories/socket_repository';

export interface ServerToClientEvents {
  chat_message: (message: SendMessageDao) => void;
  notification: (message: string) => void;
}

export interface ClientToServerEvents {
  join_room: (user_id: number) => void;
  leave_room: (user_id: number) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number;
}
