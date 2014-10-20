/*jslint node: true */
'use strict';

var util = require('./util'),
    events = require('./events'),
    messages = {},
    files = {},
    ns = {};


var app = {

    setMessage: function (data) {
        messages[data.room] = data.message;
    },

    setUpload: function (data) {
        var file = { filename: data.file.filename, url: data.file.url };
        files[data.room] = file;
    },

    start: function (namespace) {

        ns = namespace;

        ns.on(events.ON_CONNECT, function (socket) {

            var broadcastMessage = function (data) {
                app.setMessage(data);
                ns.to(data.room).emit(events.ON_MESSAGE, data.message);
            };

            var broadcastUpload = function (data) {
                app.setUpload(data);
                ns.to(data.room).emit(events.ON_UPLOAD, files[data.room]);
            };


            socket.emit(events.ON_CONNECT, '');

            socket.on(events.ON_JOIN, function (roomName) {
                
                var room = util.getOrCreateRoom(roomName);
                socket.join(room);
                socket.emit(events.ON_DISCOVER, room);

                if (messages.hasOwnProperty(room)) {
                    broadcastMessage({room: room, message: messages[room]});
                }

                if (files.hasOwnProperty(room)) {
                   broadcastUpload({room: room, file: files[room]}); 
                }

            });

            socket.on(events.ON_MESSAGE, broadcastMessage);

            socket.on(events.ON_UPLOAD, broadcastUpload);

        });
    }

};

module.exports = app;
