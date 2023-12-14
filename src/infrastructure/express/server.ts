import express from 'express';
import { ZodError } from 'zod';

import type GetAllUserController from '#infrastructure/controllers/getall_user_controller';
import { RegisterUserController } from '#infrastructure/controllers/register_user_controller';
import { createServer } from 'http';
import { sendMessageSchema } from '#domain/schema/message_schema';
import type NotificationUsecase from '#domain/usecases/notification_usecase';

export class HttpServer {
  #registerUserController: RegisterUserController;
  #getAllUserController: GetAllUserController;
  #httpServer: ReturnType<typeof createServer>;
  #app = express();

  constructor(
    registerUserController: RegisterUserController,
    getAllUserController: GetAllUserController,
  ) {
    this.#registerUserController = registerUserController;
    this.#getAllUserController = getAllUserController;
    this.#httpServer = createServer(this.#app);
  }

  get httpServer() {
    return this.#httpServer;
  }

  public run(port: number, notificationService: NotificationUsecase) {
    this.#app.use(express.json());

    this.#app.post('/users', (req, res) => {
      this.#registerUserController
        .handle(req)
        .then((data) => res.status(201).json(data))
        .catch((error: unknown) => {
          if (error instanceof ZodError) {
            res.status(400).json({ message: error.issues });
            return;
          }
          res.status(500).json({ message: error });
        });
    });

    this.#app.get('/users', (_, res) => {
      this.#getAllUserController
        .handle()
        .then((data) => res.status(200).json(data))
        .catch((error: unknown) => {
          res.status(500).json({ message: error });
        });
    });

    this.#app.post('/message', async (req, res) => {
      try {
        const data = sendMessageSchema.parse(req.body);
        const response = await notificationService.handle(data);
        res.status(201).json(response);
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          res.status(400).json({ message: error.issues });
          return;
        }
        res.status(500).json({ message: error });
      }
    });

    this.#httpServer.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}
