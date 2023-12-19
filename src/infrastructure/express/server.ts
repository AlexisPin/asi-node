import express from 'express';
import { createServer } from 'http';

import type { MessageDto } from '#domain/contracts/dto/message_dto';
import { sendMessageSchema } from '#domain/schema/message_schema';
import { type RegisterUserSchema, registerUserSchema } from '#domain/schema/register_user_schema';
import type GetAllUserController from '#infrastructure/controllers/getall_user_controller';
import type RegisterUserController from '#infrastructure/controllers/register_user_controller';
import type SendChatMessageController from '#infrastructure/controllers/send_chat_message_controller';
import { errorHandler, notFound } from '#infrastructure/middleware/exceptions';
import { validation as validate } from '#infrastructure/middleware/validations';
import type { ClientToServerEvents, ServerToClientEvents } from '#infrastructure/socket/type';
import { Server } from 'socket.io';
import type CreateGameController from '#infrastructure/controllers/create_game_controller';
import type FindGameController from '#infrastructure/controllers/find_game_controller';
import { registerPlayerSchema } from '#domain/schema/player_schema';

export class HttpServer {
  #httpServer: ReturnType<typeof createServer>;
  #app = express();
  io: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor() {
    this.#httpServer = createServer(this.#app);
    this.io = new Server(this.#httpServer, {
      cors: {
        origin: '*',
      },
    });
  }

  public run(
    port: number,
    registerUserController: RegisterUserController,
    getAllUserController: GetAllUserController,
    sendChatMessageController: SendChatMessageController,
    createGameController: CreateGameController,
    findGameController: FindGameController,
  ) {
    this.#app.use(express.json());

    this.#app.get('/', (_, res) => res.status(200).json({ uptime: process.uptime() }));

    this.#app.post('/users', validate(registerUserSchema), (req, res, next) => {
      registerUserController
        .handle(req.body as RegisterUserSchema)
        .then((data) => res.status(201).json(data))
        .catch((error: Error) => {
          next(error);
        });
    });

    this.#app.get('/users', (_, res, next) => {
      getAllUserController
        .handle()
        .then((data) => res.status(200).json(data))
        .catch((error: Error) => {
          next(error);
        });
    });

    this.#app.post('/message', validate(sendMessageSchema), (req, res, next) => {
      sendChatMessageController
        .handle(req.body as MessageDto)
        .then((data) => res.status(201).json(data))
        .catch((error: Error) => {
          next(error);
        });
    });

    this.#app.post('/game/create', validate(registerPlayerSchema), (req, res, next) => {
      createGameController
        .handle(req.body)
        .then((data) => res.status(201).json(data))
        .catch((error: Error) => {
          next(error);
        });
    });


    this.#app.post('/game/find', validate(registerPlayerSchema), (req, res, next) => {
      findGameController
        .handle(req.body)
        .then((data) => res.status(201).json(data))
        .catch((error: Error) => {
          next(error);
        });
    });


    this.#app.use(notFound);

    this.#app.use(errorHandler);

    this.#httpServer.listen(port);
  }
}

