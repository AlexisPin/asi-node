import type { MessageDto } from "#domain/dto/message_dto";

export interface SendMessageDao extends MessageDto {
    conversation_id: string;
    timestamp: number;
}

export default abstract class SocketRepository {
    abstract send(message: SendMessageDao): SendMessageDao;
}
