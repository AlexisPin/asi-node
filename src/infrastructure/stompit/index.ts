import BusRepository from '#domain/contracts/repositories/bus_repository';
import stompit from 'stompit';

export default class Stompit extends BusRepository {
  #client: stompit.Client | null;

  #headers = {
    destination: '/queue/chat_messages',
  };

  #connectOptions = {
    host: 'localhost',
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
      stompit.connect(this.#connectOptions, (error, client) => {
        if (error) {
          reject(error);
        } else {
          this.#client = client;
          resolve(client);
        }
      });
    });
  }

  async send_chat_message(message: string) {
    if (!this.#client) return;
    const frame = this.#client.send(this.#headers);
    frame.write(message);
    frame.end();
  }

  async subscribe(callback: (message: string) => void) {
    if (!this.#client) return;
    this.#client.subscribe(this.#headers, (error, message) => {
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
