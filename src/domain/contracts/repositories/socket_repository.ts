import type { MessageDto } from '#domain/contracts/dto/message_dto';

export interface CreateMessageDto extends Omit<MessageDto, 'receiver_id'> {
  conversation_id: string;
  timestamp: number;
}

export default abstract class SocketRepository {
  abstract send_chat_message(message: CreateMessageDto): Promise<CreateMessageDto>;
  abstract send(message: string): void;
}
