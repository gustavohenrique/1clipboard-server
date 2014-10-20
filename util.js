'use strict';

var util = {
    createRandomRoom: function () {
        var room = '',
            possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        for (var i=0; i < 5; i++ ) {
            room += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return room;
    },

    getOrCreateRoom: function (room) {
        if (room === undefined || room === '' || room.length === 0) {
            return util.createRandomRoom();
        }
        return room;
    }
};

module.exports = util;
