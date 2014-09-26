'use strict';

var util = {
    createRandomRoom: function () {
        var room = '',
            possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        for (var i=0; i < 5; i++ ) {
            room += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return room;
    }
};

module.exports = util;
