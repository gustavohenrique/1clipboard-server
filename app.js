'use strict';

var util = require('./util'),
    messages = {},
    files = {};


var app = {

    start: function (namespace) {

        namespace.on('connection', function (socket) {
            var room = '',
                broadcast = function (room, evt, message) {
                    namespace.to(room).emit(evt, message);
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
                    broadcast(room, 'clipboard', messages[room]);
                }

                if (files.hasOwnProperty(room)) {
                    broadcast(room, 'upload', files[room]);
                }
            });

            socket.on('clipboard', function (data) {
                var message = data.message;
                messages[data.room] = message;
                broadcast(data.room, 'clipboard', message);
                //namespace.emit('clipboard', message);
            });

            socket.on('upload', function (data) {
                var file = { filename: data.file.filename, url: data.file.url };
                files[data.room] = file;
                broadcast(data.room, 'upload', file);
            });
         
        });
    }
};

module.exports = app;
