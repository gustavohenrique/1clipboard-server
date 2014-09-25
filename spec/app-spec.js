var app = require('../app');
var serverIo = require('socket.io'),
    server = null,
    clientIo = require('socket.io-client'),
    client = null,
    NAMESPACE = '/beta',
    URL = 'http://localhost:3000/beta';

describe('backend', function () {


    beforeEach(function() {
        server = serverIo.listen(5000);
        app.start(server.of(NAMESPACE));
    });

    // afterEach(function() {
    //     client.disconnect();
    //     server.close();
    // });

    it('Server emit connection on connection', function(done) {
        client = clientIo.connect(URL, {reconnection: false, transports: ['websocket'], forceNew: true});
        expect(client.connected).toBe(true);
        client.on('connection', function (message) {
            expect(message).toBe('');
            done();
        });
        done();
        //client.disconnect();
        // expect(1+1).toBe(2);
    });
});