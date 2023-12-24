import stompit from 'stompit';

import BusRepository from '#domain/contracts/repositories/bus_repository';

export default class StompitRepository extends BusRepository {
  #client: stompit.Client | null;

  #chat_headers = {
    'destination': '/queue/chat_messages',
    'Content-Type': 'application/json',
    'ObjectType': 'com.cpe.springboot.msgreceiver.Message',
  };

  #user_headers = {
    'destination': '/queue/update_user',
    'Content-Type': 'application/json',
    'ObjectType': 'com.model.RichUserDTO',
  };

  #connectOptions = {
    host: '172.25.144.1',
    port: 61613,
    connectHeaders: {
      'host': '/',
      'login': 'myuser',
      'passcode': 'mypwd',
      'heart-beat': '5000,5000',
    },
  };

  constructor() {
    super();
    this.#client = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.#client = stompit.connect(this.#connectOptions, (error, client) => {
        if (error) {
          reject(error);
        } else {
          resolve(client);
        }
      });
    });
  }

  send_chat_message(message: string) {
    if (!this.#client) return;
    const frame = this.#client.send(this.#chat_headers);
    frame.write(message);
    frame.end();
  }

  send_user_update(message: string) {
    if (!this.#client) return;
    const frame = this.#client.send(this.#user_headers);
    frame.write(message);
    frame.end();
  }

  subscribe(callback: (message: string) => void) {
    if (!this.#client) return;
    this.#client.subscribe(this.#chat_headers, (error, message) => {
      if (error) {
        console.log('subscribe error ' + error.message);
        return;
      }
      message.readString('utf-8', (error, body) => {
        if (error) {
          console.log('read message error ' + error.message);
          return;
        }
        if (!body) return;
        callback(body);
      });
    });
    this.#client.subscribe(this.#user_headers, (error, message) => {
      if (error) {
        console.log('subscribe error ' + error.message);
        return;
      }
      message.readString('utf-8', (error, body) => {
        if (error) {
          console.log('read message error ' + error.message);
          return;
        }
        if (!body) return;
        callback(body);
      });
    });
  }
}
