import type { SendMessageDao } from '#domain/contracts/repositories/socket_repository';
import type SocketRepository from '#domain/contracts/repositories/socket_repository';
import type { MessageDto } from '#domain/dto/message_dto';

export default class SendMessageUsecase {
  constructor(private socketRepository: SocketRepository) {}

  handle(payload: MessageDto): Promise<SendMessageDao> {
    const conversation_id = [payload.sender_id, payload.receiver_id].sort().join('_');
    const timestamp = new Date().getTime();
    const { receiver_id, ...rest } = payload;
    const message: SendMessageDao = {
      ...rest,
      conversation_id,
      timestamp,
    };
    return this.socketRepository.send_chat_message(message);
  }
}
