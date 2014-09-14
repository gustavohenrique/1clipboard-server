var room = window.location.href.split('?')[1] || '';

var URL = 'http://localhost:3000/beta';
var socket = io(URL);

var textarea = document.getElementById('message');

socket.on('connection', function () {
    socket.emit('enter', room);

    socket.on('clipboard', function (message) {
        textarea.value = message;
    });

    socket.on('discover', function (roomName) {
        room = roomName;
        document.getElementById('room').innerHTML = room;
    });
});


var emitMessageOnKeyup = function () {
    socket.emit('clipboard', { 'room': room, 'message': textarea.value });
};

window.onload = function() {
    textarea.focus();
};