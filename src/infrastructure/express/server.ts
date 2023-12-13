import express from 'express';
import { ZodError } from 'zod';

import type GetAllUserController from '#infrastructure/controllers/getall_user_controller';
import { RegisterUserController } from '#infrastructure/controllers/register_user_controller';
import { Server } from 'socket.io';
import { createServer } from 'http';
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '#infrastructure/socket/type';
import SocketServer from '../socket/socket_repository';
import { sendMessageSchema } from '#domain/schema/register_user_schema';
import SendMessageUsecase from '#domain/usecases/send_message_usecase';

export class HttpServer {
  public static run(
    port: number,
    registerUserController: RegisterUserController,
    getAllUserController: GetAllUserController,
  ) {
    const app = express();
    const httpServer = createServer(app);
    
    const io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(httpServer, {
      cors: {
        origin: '*',
      },
    })

    const socketServer = new SocketServer(io, registerUserController);
    const sendMessageController = new SendMessageUsecase(socketServer);

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

    app.post("/message", (req, res) => {
      try {
        const data = sendMessageSchema.parse(req.body); 
        const response = sendMessageController.handle(data);
        res.status(201).json(response);
      } catch (error : unknown) {
        if (error instanceof ZodError) {
          res.status(400).json({ message: error.issues });
          return;
        }
        res.status(500).json({ message: error });
      }
    });

    httpServer.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}
