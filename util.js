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

    encode: function (message) {
        return unescape( encodeURIComponent( JSON.stringify(message) ) );
    },

    decode: function (message) {
        try { 
            decodeURIComponent( escape (message) ) ;
        }
        catch (e) {
            return message;
        }
    }
};

module.exports = util;
