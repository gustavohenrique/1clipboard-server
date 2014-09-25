const serverPort = process.argv[2] || 3000;
var io = require('socket.io').listen(serverPort),
    namespace = io.of('/beta'),
    app = require('./app');

app.start(namespace);
