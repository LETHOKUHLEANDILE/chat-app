const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let onlineUsers = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('login', (username) => {
        socket.username = username;
        onlineUsers[socket.id] = username;
        io.emit('system message', `${username} has joined the chat`);
        io.emit('online users', Object.values(onlineUsers));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        if (socket.username) {
            io.emit('system message', `${socket.username} has left the chat`);
            delete onlineUsers[socket.id];
            io.emit('online users', Object.values(onlineUsers));
        }
    });

    socket.on('chat message', (msg) => {
        const timestamp = new Date().toLocaleTimeString();
        io.emit('chat message', {
            username: socket.username,
            text: msg,
            timestamp: timestamp
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
