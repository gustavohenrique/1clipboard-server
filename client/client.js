'use strict';

var config = {
    room: window.location.href.split('?')[1] || '',
    URL: 'http://localhost:3000/beta'
};

var components = {
    textarea: $('#message'),
    errorPanel: $('#errorPanel'),
    successPanel: $('#successPanel')
};


var app = {

    message: '',

    connect: function () {
        socket.emit('enter', config.room);

        socket.on('clipboard', function (message) {
            components.textarea.val(message);
        });

        socket.on('discover', function (roomName) {
            config.room = roomName;
            document.getElementById('room').innerHTML = config.room;
        });
    },

    error: function () {
        components.errorPanel.show();
        components.textarea.hide();
    },

    reconnect: function () {
        components.errorPanel.hide();
        components.successPanel.show();
        setTimeout(function () {
            components.successPanel.hide();
            components.textarea.show();
            components.textarea.focus();
        }, 2000)
    },

    sendMessage: function () {
        var m = components.textarea.val();
        if (message !== m) {
            message = m;
            socket.emit('clipboard', { 'room': config.room, 'message': message });
        }    
    },

    clearMessage: function () {
        components.textarea.val('');
        components.textarea.focus();
    },

    selectAll: function () {
        components.textarea.focus();
        components.textarea.select();
    }
};

var socket = io(config.URL, {
    reconnectionDelay: 2000
});
socket.on('connection', app.connect);
socket.on('connect_error', app.error);
socket.on('reconnect', app.reconnect);

window.onload = function () {
    components.textarea.focus();
    setInterval(app.sendMessage, 1500);
};

window.onresize = function () {
    components.textarea.css('min-height', $(window).height() - $('.sticky').outerHeight())
};
