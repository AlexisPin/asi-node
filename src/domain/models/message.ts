
export class Message {
  content: string;
  sender_id: number;
  conversation_id: string;
  timestamp: number;

  constructor(
    content: string,
    sender_id: number,
    conversation_id: string,
    timestamp: number,
  ) {
    this.content = content;
    this.sender_id = sender_id;
    this.conversation_id = conversation_id;
    this.timestamp = timestamp;
  }
}
