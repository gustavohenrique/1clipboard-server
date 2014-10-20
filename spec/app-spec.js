var app = require('../app');
var serverIo = require('socket.io'),
    server = null,
    clientIo = require('socket.io-client'),
    client = null,
    NAMESPACE = '/beta',
    URL = 'http://localhost:5000/beta';

describe('Socket.io', function () {


    beforeEach(function() {
        io = serverIo.listen(5000);
        app.start(io.of(NAMESPACE));
        client = clientIo.connect(URL, {reconnection: false, transports: ['websocket'], forceNew: true});
    });

    afterEach(function(done) {
        io.close();
        done();
    });

    it('server send empty string and via "connection"', function(done) {
        client.on('connection', function (message) {
            expect(message).toBe('');
            done();
        });
    });

    it('when client emit "enter" then server send room name via "discover"', function(done) {
        var roomName = 'my room';
        client.emit('enter', roomName);
        client.on('discover', function (message) {
            expect(message).toBe(roomName);
            done();
        });
    });

    it('when client emit "enter" with no room name then server create and send a random room name via "discover"', function(done) {
        var roomName = '';
        client.emit('enter', roomName);
        client.on('discover', function (message) {
            expect(message.length).toBe(5);
            done();
        });
    });
});