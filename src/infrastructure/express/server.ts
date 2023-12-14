import express from 'express';
import { createServer } from 'http';

import type SendChatMessageController from '#infrastructure/controllers/chat_controller';
import type GetAllUserController from '#infrastructure/controllers/getall_user_controller';
import type RegisterUserController from '#infrastructure/controllers/register_user_controller';
import AppMiddleware from '#infrastructure/middleware/exceptions';

export class HttpServer {
  #httpServer: ReturnType<typeof createServer>;
  #app = express();

  constructor() {
    this.#httpServer = createServer(this.#app);
  }

  get httpServer() {
    return this.#httpServer;
  }

  public run(
    port: number,
    registerUserController: RegisterUserController,
    getAllUserController: GetAllUserController,
    sendChatMessageController: SendChatMessageController,
  ) {
    this.#app.use(express.json());

    this.#app.post('/users', (req, res) => {
      registerUserController
        .handle(req)
        .then((data) => res.status(201).json(data))
        .catch((error: unknown) => {
          res.status(500).json({ message: error });
        });
    });

    this.#app.get('/users', (_, res) => {
      getAllUserController
        .handle()
        .then((data) => res.status(200).json(data))
        .catch((error: unknown) => {
          res.status(500).json({ message: error });
        });
    });

    this.#app.post('/message', (req, res) => {
      sendChatMessageController
        .handle(req)
        .then((data) => res.status(201).json(data))
        .catch((error: unknown) => {
          res.status(500).json({ message: error });
        });
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.#app.use(AppMiddleware.notFound);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.#app.use(AppMiddleware.errorHandler);

    this.#httpServer.listen(port);
  }
}
