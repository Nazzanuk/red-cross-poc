/**
 * Created by nathannelson on 12/05/2016.
 */
'use strict';

var socketIO = require('socket.io'),
    io, socket;

module.exports = {
    start (server) {
        io = socketIO(server);

        io.on('connection', (_socket) => {
            socket = _socket;
            console.log('a user connected');

            //setTimeout(() => module.exports.broadcast('alert', {content: 'New User Connected'}), 500);
        });
    },

    emit (text, data) {
        console.log('emitting', text, data);
        io.emit(text, data);
    },

    broadcast (text, data) {
        console.log('broadcasting', text, data);
        socket.broadcast.emit(text, data);
    }
};
