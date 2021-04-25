import { Socket } from "socket.io";
import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";
import { UsersService } from "../services/UsersService";

interface IParams {
    text: string;
    email: string;
}

io.on('connection', (socket: Socket) => {
    const userService = new UsersService();
    const messageService = new MessagesService();
    const connectionsService = new ConnectionsService();


    socket.on('client_first_access', async (params: IParams) => {

        const socket_id = socket.id;
        const { text, email } = params;

        const userExists = await userService.findByEmail({ email });

        if (!userExists) {
            const user = await userService.create({ email })

            connectionsService.create({ socket_id, user_id: user.id, });
            messageService.create({ text, user_id: user.id })
        } else {
            const userConnection = await connectionsService.findByUserId({ user_id: userExists.id });
            const connection = userConnection ? { ...userConnection, socket_id } : { user_id: userExists.id, socket_id };

            connectionsService.create(connection);
            messageService.create({ text, user_id: connection.user_id })
        }
    })
});