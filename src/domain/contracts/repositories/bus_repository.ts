export default abstract class BusRepository {
  abstract send_chat_message(message: string): void;
  abstract send_user_update(message: string): void;
}
