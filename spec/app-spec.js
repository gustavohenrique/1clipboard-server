var app = require('../app/app'),
    events = require('../app/events');

var serverIo = require('socket.io'),
    clientIo = require('socket.io-client'),
    client = null;


describe('Socket.io server', function () {

    var getConnection = function () {
        return clientIo.connect('http://localhost:5000/beta', { forceNew: true });
    };

    beforeEach(function() {
        io = serverIo.listen(5000);
        app.start(io.of('/beta'));
        client = getConnection();
    });

    afterEach(function(done) {
        io.close();
        done();
    });

    it('when client will connect then server emit event for notification that connection is established', function(done) {
        client.on(events.ON_CONNECT, function (message) {
            expect(message).toBe('');
            done();
        });
    });

    it('when client join in the room then server emit the room name', function(done) {
        var roomName = 'my room';
        client.emit(events.ON_JOIN, roomName);
        client.on(events.ON_DISCOVER, function (message) {
            expect(message).toBe(roomName);
            done();
        });
    });

    it('when client try to join with empty room name then server create and join in a random room', function(done) {
        var roomName = '';
        client.emit(events.ON_JOIN, roomName);
        client.on(events.ON_DISCOVER, function (message) {
            expect(message.length).toBe(5);
            done();
        });
    });

    it('when client join in the room then server emit message via broadcast', function(done) {
        app.setMessage({room: 'myRoom', message: 'Hello World'});
        
        client.emit(events.ON_JOIN, 'myRoom');
        client.on(events.ON_MESSAGE, function (message) {
            expect(message).toBe('Hello World');
            done();
        });
    });

    it('when client join in the room then server emit info about file uploaded via broadcast', function(done) {
        app.setUpload({room: 'myRoom',
            file: {
                filename: 'my-script.js', 
                url: 'http://drive.google.com/my-script.js'
            }
        });
        
        client.emit(events.ON_JOIN, 'myRoom');
        client.on(events.ON_UPLOAD, function (file) {
            expect(file.filename).toBe('my-script.js');
            expect(file.url).toBe('http://drive.google.com/my-script.js');
            done();
        });
    });

    it('when client emit a message then server notify all clients via broadcast', function(done) {
        var room = 'my-Room';

        client.emit(events.ON_JOIN, room);
        
        var client2 = getConnection();
        client2.emit(events.ON_JOIN, room);

        client.emit(events.ON_MESSAGE, {room: room, message: 'Hello World'});
        client.on(events.ON_MESSAGE, function (message) {
            expect(message).toBe('Hello World');
            
            client2.on(events.ON_MESSAGE, function (message) {
                expect(message).toBe('Hello World');
                done();
            });
        });
        
    });

    it('when client emit a file upload then server notify all clients via broadcast', function(done) {
        var room = 'my room';

        client.emit(events.ON_JOIN, room);
        
        var client2 = getConnection();
        client2.emit(events.ON_JOIN, room);

        client.emit(events.ON_UPLOAD, {room: room, file: { filename: 'file.pdf', url: 'http://drive.google.com/file.pdf' }});
        client.on(events.ON_UPLOAD, function (file) {
            expect(file.filename).toBe('file.pdf');
            expect(file.url).toBe('http://drive.google.com/file.pdf');
            
            client2.on(events.ON_UPLOAD, function (file) {
                expect(file.filename).toBe('file.pdf');
                expect(file.url).toBe('http://drive.google.com/file.pdf');
                done();
            });
        });
        
    });

});