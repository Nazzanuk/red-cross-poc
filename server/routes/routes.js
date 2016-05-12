'use strict';

var Get = require('./get');
var Post = require('./post');

module.exports = {
    init: (app) => {
        app.get('/db/:collection', Get.dbCollection);
        app.post('/db/:collection', Post.dbInsert);
        app.get('/csv/:collection', Get.getCSV);
        app.get('/print', Get.print);
        app.get('*', Get.index);
        app.post('/image/', Post.image);
    }
};