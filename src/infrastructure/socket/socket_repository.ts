import type { Server } from "socket.io";
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./type";
import SocketRepository, { type SendMessageDao } from "#domain/contracts/repositories/socket_repository";
import { findUser } from "../undici";
import type { RegisterUserController } from "#infrastructure/controllers/register_user_controller";
import { springUserSchema } from "./spring_user_dto";

export default class SocketServer extends SocketRepository {

    constructor(private io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData
    >, private registerUserController: RegisterUserController) {
        super();
        io.on('connection', async (socket) => {
            const user_id = socket.handshake.query["id"];
            if (user_id === undefined || Array.isArray(user_id) || Number.isNaN(Number(user_id))) {
                socket.disconnect();
                return;
            }
            const { body } = await findUser(user_id)
            const data = await body.json();
            const user = springUserSchema.parse(data);
            registerUserController.handle(user);
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }

    send(message: SendMessageDao): SendMessageDao {
        this.io.emit('message', message);
        return message;
    }
}

