const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// store user names when a connection is made and a user-join msg is received from script.js
const users = {};

app.use(express.static(__dirname + '/'));

io.on('connection', socket => {
    // socket.emit('chat-message', 'Hello chat');
    socket.on('user-join', username => {
        users[socket.id] = username;
        // template strings, like python's fstrings `here is a variable ${var}`
        io.emit('chat-message', (`${username} has joined the chat`));
        io.emit('user-list', Object.values(users).join(", "));
    });
    // receive chat message from clients
    socket.on('send-chat-message', message => {
        // console.log(message);
        io.emit('chat-message', `${users[socket.id]}: ${message}`);
        // TODO: give users a color to differentiate between messages
    });
    socket.on('disconnect', () => {
        io.emit('chat-message', `${users[socket.id]} has left the chat`);
        delete users[socket.id];
        io.emit('user-list', Object.values(users).join(", "));
        // io.emit('chat-message', `size of users ${Object.keys(users).length}`);  // track number of users in the chat
    });
});

// for heroku use process.env.PORT || 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
