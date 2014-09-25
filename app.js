'use strict';

var util = require('./util'),
    messages = {};


var app = {

    start: function (namespace) {

        namespace.on('connection', function (socket) {
            console.log('conectou');
            var room = '',
                broadcast = function (room, message) {
                    namespace.to(room).emit('clipboard', message);
                };

            socket.emit('connection', '');

            socket.on('enter', function (roomName) {
                room = roomName;
                if (roomName === undefined || roomName === '' || roomName.length === 0) {
                    room = util.createRandomRoom();
                }

                socket.join(room);
                socket.emit('discover', room);

                if (messages.hasOwnProperty(room)) {
                    broadcast(room, messages[room]);
                }
            });

            socket.on('clipboard', function (data) {
                messages[data.room] = data.message;
                broadcast(data.room, data.message);
                //namespace.emit('clipboard', message);
            });
         
        });
    }
};

module.exports = app;
