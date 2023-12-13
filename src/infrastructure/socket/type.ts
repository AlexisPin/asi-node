import type { SendMessageDao } from "#domain/contracts/repositories/socket_repository";

export interface ServerToClientEvents {
    message: (message: SendMessageDao) => void;
}

export interface ClientToServerEvents {

}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    id: number;
}