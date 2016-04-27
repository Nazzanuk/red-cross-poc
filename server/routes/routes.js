'use strict';

var Get = require('./get');
var Post = require('./post');

module.exports = {
    init: (app) => {
        app.get('/print/:url', Get.print);
        app.get('/print', Get.print);
        app.get('*', Get.index);
        app.post('/image/', Post.image);
    }
};