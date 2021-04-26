const socket = io();
let connectionsUsers = [];

socket.on('admin_list_all_users', connections => {

    document.getElementById('list_users').innerHTML = '';
    let template = document.getElementById('template').innerHTML;

    connectionsUsers = connections;

    connections.forEach(connection => {
        const rendered = Mustache.render(template, {
            email: connection.user.email,
            id: connection.socket_id,
        });

        document.getElementById('list_users').innerHTML += rendered;
    });
});

function call(id) {
    const connection = connectionsUsers.find(i => i.socket_id === id);

    const template = document.getElementById('admin_template').innerHTML;

    const rendered = Mustache.render(template, {
        email: connection.user.email,
        id: connection.user_id,
    });

    document.getElementById('supports').innerHTML += rendered;

    const params = { user_id: connection.user.id, }

    socket.emit('admin_user_in_support', params);

    socket.emit('admin_list_messages_by_user', params, messages => {
        const divMessages = document.getElementById(`allMessages${connection.user_id}`);

        messages.forEach(i => {
            const createDiv = document.createElement('div');

            if (i.admin_id === null) {
                createDiv.className = 'admin_message_client';
                createDiv.innerHTML = `<span>${connection.user.email} </span>`;
                createDiv.innerHTML += `<span>${i.text}</span>`;
                createDiv.innerHTML += `<span class='admin_date'>${dayjs(i.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>`;
            } else {
                createDiv.className = 'admin_message_admin';
                createDiv.innerHTML = `Atendente: <span>${i.text}</span>`;
                createDiv.innerHTML += `<span class='admin_date>${dayjs(i.created_at).format('DD/MM/YYYY HH:mm:ss')}`;
            }

            divMessages.appendChild(createDiv);
        });
    });
}

function sendMessage(user_id) {
    const text = document.getElementById(`send_message_${user_id}`).value;

    const params = { text, user_id, };

    console.log(params)

    socket.emit('admin_send_message', params);

    const divMessages = document.getElementById(`allMessages${user_id}`);

    const createDiv = document.createElement('div');
    createDiv.className = 'admin_message_admin';
    createDiv.innerHTML = `Atendente: <span>${text}</span>`;
    createDiv.innerHTML += `<span class='admin_date>${dayjs().format('DD/MM/YYYY HH:mm:ss')}`;

    divMessages.appendChild(createDiv);

    text.value = '';
}

socket.on("admin_receive_message", ({ message, socket_id }) => {
    const connection = connectionsUsers.find(i => i.socket_id = socket_id);

    const divMessages = document.getElementById(`allMessages${connection.user_id}`);
    const createDiv = document.createElement("div");

    createDiv.className = "admin_message_client";
    createDiv.innerHTML = `<span>${connection.user.email} </span>`;
    createDiv.innerHTML += `<span>${message.text}</span>`;
    createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;

    divMessages.appendChild(createDiv);
});