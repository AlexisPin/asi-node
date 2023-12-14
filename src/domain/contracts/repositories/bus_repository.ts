export default abstract class BusRepository {
  abstract send_chat_message(message: string): void;
}
