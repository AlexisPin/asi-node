import type { SendMessageDao } from '#domain/contracts/repositories/socket_repository';

export interface ServerToClientEvents {
  chat_message: (message: SendMessageDao) => void;
  notification: (message: string) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number;
}
