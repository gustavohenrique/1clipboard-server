var room = window.location.href.split('?')[1] || '';

var URL = 'http://gustavohenrique.com:3001/beta';
//var URL = 'http://share-clipboard.herokuapps.com:3000/beta';
var socket = io(URL);

var message = '';
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


var sendMessage = function () {
    if (message !== textarea.value) {
        message = textarea.value;
        socket.emit('clipboard', { 'room': room, 'message': message });
    }    
};

var clearMessage = function () {
    textarea.value = '';
    textarea.focus();
};

window.onload = function() {
    textarea.focus();
    setInterval(sendMessage, 2000);
};