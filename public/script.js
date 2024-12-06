const socket = io();

document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (username) {
        socket.emit('login', username);
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
    } else {
        alert('Username cannot be empty');
    }
});

document.getElementById('send-btn').addEventListener('click', () => {
    const message = document.getElementById('message-input').value.trim();
    if (message) {
        socket.emit('chat message', message);
        document.getElementById('message-input').value = '';
    } else {
        alert('Message cannot be empty');
    }
});

socket.on('chat message', function(msg) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `[${msg.timestamp}] ${msg.username}: ${msg.text}`;
    document.getElementById('messages').appendChild(messageDiv);

    if (document.hidden) {
        new Notification('New message', {
            body: `${msg.username}: ${msg.text}`,
        });
    }
});

if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

socket.on('system message', function(msg) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = msg;
    messageDiv.classList.add('system-message');
    document.getElementById('messages').appendChild(messageDiv);
});

socket.on('online users', function(users) {
    const onlineUsersDiv = document.getElementById('online-users');
    onlineUsersDiv.innerHTML = '<h3>Online Users</h3>';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.textContent = user;
        onlineUsersDiv.appendChild(userDiv);
    });
});

socket.on('connect_error', (err) => {
    console.error(`Connection error: ${err.message}`);
    alert('Failed to connect to the server. Please try again later.');
});
