import type { MessageDto } from '#domain/contracts/dto/message_dto';
import type BusRepository from '#domain/contracts/repositories/bus_repository';
import type { CreateMessageDto } from '#domain/contracts/repositories/socket_repository';
import type SocketRepository from '#domain/contracts/repositories/socket_repository';
import { Message } from '#domain/models/message';
import { generate_id } from '#domain/utils/generate_id';

export default class SendChatMessageUsecase {
  constructor(
    private busRepository: BusRepository,
    private socketRepository: SocketRepository,
  ) { }

  handle(payload: MessageDto): Promise<CreateMessageDto> {
    const conversation_id = generate_id(payload.sender_id, payload.receiver_id);
    const timestamp = new Date().getTime();

    const message = new Message(
      payload.content,
      payload.sender_id,
      conversation_id,
      timestamp,
    );

    const busPayload = {
      content: payload.content,
      sender_id: payload.sender_id,
      receiver_id: payload.receiver_id,
      timestamp,
    };

    this.busRepository.send_chat_message(JSON.stringify(busPayload));
    return this.socketRepository.send_chat_message(message);
  }
}
