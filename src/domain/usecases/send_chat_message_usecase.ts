import type BusRepository from '#domain/contracts/repositories/bus_repository';
import type { SendMessageDao } from '#domain/contracts/repositories/socket_repository';
import type SocketRepository from '#domain/contracts/repositories/socket_repository';
import type { MessageDto } from '#domain/dto/message_dto';
import { generate_id } from '#domain/utils/generate_id';

export default class SendChatMessageUsecase {
  constructor(
    private busRepository: BusRepository,
    private socketRepository: SocketRepository,
  ) {}

  handle(payload: MessageDto): Promise<SendMessageDao> {
    const conversation_id = generate_id(payload.sender_id, payload.receiver_id);
    const timestamp = new Date().getTime();

    const message: SendMessageDao = {
      content: payload.content,
      sender_id: payload.sender_id,
      conversation_id,
      timestamp,
    };
    this.busRepository.send_chat_message(JSON.stringify(message));
    return this.socketRepository.send_chat_message(message);
  }
}
