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
    let user_id = null;


    socket.on('client_first_access', async (params: IParams) => {

        const socket_id = socket.id;
        const { text, email } = params;

        const userExists = await userService.findByEmail({ email });

        if (!userExists) {
            const user = await userService.create({ email })

            await connectionsService.create({ socket_id, user_id: user.id, });
            await messageService.create({ text, user_id: user.id })
            user_id = user.id;
        } else {
            user_id = userExists.id
            const userConnection = await connectionsService.findByUserId({ user_id: userExists.id });
            const connection = userConnection ? { ...userConnection, socket_id } : { user_id: userExists.id, socket_id };

            await connectionsService.create(connection);
        }

        await messageService.create({ text, user_id: user_id })

        const allMessages = await messageService.listByUserId({ user_id })

        socket.emit('client_list_all_messages', allMessages);

        const allUsers = await connectionsService.findAllWithoutAdmin();
        io.emit('admin_list_all_users', allUsers);
    })

    socket.on('client_send_to_admin', async ({ text, socket_admin_id }) => {
        const socket_id = socket.id;

        const { user_id } = await connectionsService.findBySocketId({ socket_id });

        const message = await messageService.create({ text, user_id });

        io.to(socket_admin_id).emit('admin_receive_message', { message, socket_id });
    })
});