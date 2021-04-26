import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";

io.on('connect', async socket => {
    const messagesService = new MessagesService();
    const connectionsService = new ConnectionsService();

    const allConnectionWithoutAdmin = await connectionsService.findAllWithoutAdmin();

    io.emit('admin_list_all_users', allConnectionWithoutAdmin);

    socket.on('admin_list_messages_by_user', async (params, callback) => {
        const { user_id } = params;

        const allMessages = await messagesService.listByUserId({ user_id });
        callback(allMessages);
    });

    socket.on('admin_send_message', async ({ user_id, text }) => {
        await messagesService.create({ text, user_id, admin_id: socket.id, });

        const { socket_id } = await connectionsService.findByUserId({ user_id });

        io.to(socket_id).emit('admin_send_to_client', { text, socket_id: socket.id, });
    });

    socket.on('admin_user_in_support', async ({ user_id }) => {
        await connectionsService.updateAdminId({ user_id, admin_id: socket.id });

        const allConnectionWithoutAdmin = await connectionsService.findAllWithoutAdmin();

        io.emit('admin_list_all_users',  allConnectionWithoutAdmin);
    });
});