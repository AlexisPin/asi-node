import express from 'express';
import { ZodError } from 'zod';

import type GetAllUserController from '#infrastructure/controllers/getall_user_controller';
import { RegisterUserController } from '#infrastructure/controllers/register_user_controller';

export class HttpServer {
  public static run(
    port: number,
    registerUserController: RegisterUserController,
    getAllUserController: GetAllUserController,
  ) {
    const app = express();
    app.use(express.json());

    app.post('/users', (req, res) => {
      registerUserController
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

    app.get('/users', (_, res) => {
      getAllUserController
        .handle()
        .then((data) => res.status(200).json(data))
        .catch((error: unknown) => {
          res.status(500).json({ message: error });
        });
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}
