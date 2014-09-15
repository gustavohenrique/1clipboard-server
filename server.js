
const serverPort = process.argv[2] || 3000;
var io = require('socket.io').listen(serverPort);
io.origins('*');

var createRandomRoom = function () {
    var room = '',
        possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (var i=0; i < 5; i++ ) {
        room += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return room;
};

var broadcast = function (room, message) {
    namespace.to(room).emit('clipboard', message);
};

var messages = {};

var namespace = io.of('/beta');
namespace.on('connection', function (socket) {
    console.log(socket.handshake);
    var room = '';
    socket.emit('connection', '');

    socket.on('enter', function (roomName) {
        if (roomName !== undefined && roomName !== '' && roomName.length > 0) {
            room = roomName;
        }
        else {
            room = createRandomRoom();
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
