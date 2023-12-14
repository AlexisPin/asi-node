import type { MessageDto } from '#domain/dto/message_dto';

export interface SendMessageDao extends Omit<MessageDto, 'receiver_id'> {
  conversation_id: string;
  timestamp: number;
}

export default abstract class SocketRepository {
  abstract send_chat_message(message: SendMessageDao): Promise<SendMessageDao>;
  abstract send(message: string): void;
}
