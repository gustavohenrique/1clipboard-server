'use strict';

var config = {
    room: window.location.href.split('?')[1] || '',
    URL: 'http://localhost:3000/beta',
    intervals: {
        sendMessage: 2000,
        reconnect: 2000
    }
};

var components = {
    textarea: $('#message'),
    errorPanel: $('#errorPanel'),
    successPanel: $('#successPanel'),
    topBar: $('#topBar'),
    footer: $('footer')
};


var app = {

    timer: null,

    connect: function () {
        socket.emit('enter', config.room);

        socket.on('clipboard', function (message) {
            components.textarea.val(message);
        });

        socket.on('discover', function (roomName) {
            components.footer.show();
            config.room = roomName;
            document.getElementById('room').innerHTML = config.room;
        });
    },

    error: function () {
        components.errorPanel.show();
        components.textarea.hide();
        components.footer.hide();
    },

    reconnect: function () {
        components.errorPanel.hide();
        components.successPanel.show();
        setTimeout(function () {
            components.footer.show();
            components.successPanel.hide();
            components.textarea.show();
            components.textarea.focus();
        }, config.intervals.reconnect)
    },

    sendMessage: function () {
        var message = components.textarea.val();
        socket.emit('clipboard', { 'room': config.room, 'message': message });
    },

    clearMessage: function () {
        components.textarea.val('');
        components.textarea.focus();
    },

    selectAll: function () {
        components.textarea.focus();
        document.getElementById('message').setSelectionRange(0, components.textarea.val().length);
    },

    resizeComponents: function () {
        var w =$(window),
            footerHeight = $('.footer').height(),
            height = w.height() - components.topBar.height() - footerHeight,
            width = w.width();

        var getScrollBarWidth = function () {
            var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
                widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).width();
                $outer.remove();
            return 100 - widthWithScroll;
        };

        components.textarea.css('min-height', height - 20);
        components.textarea.css('min-width', width - getScrollBarWidth() - 5);
    },

    startTimer: function () {
        clearTimeout(app.timer);
        app.timer = setTimeout(app.sendMessage, config.intervals.sendMessage);
    },

    stopTimer: function () {
        clearTimeout(app.timer);
    }
};

var socket = io(config.URL, {reconnectionDelay: config.intervals.reconnect});
socket.on('connection', app.connect);
socket.on('connect_error', app.error);
socket.on('reconnect', app.reconnect);

components.textarea.on('keyup', app.startTimer);
components.textarea.on('keydown', app.stopTimer);
components.textarea.on('paste', app.startTimer);

window.onload = function () {
    app.resizeComponents();
    components.textarea.focus();
};

window.onresize = function () {
    app.resizeComponents();
};
