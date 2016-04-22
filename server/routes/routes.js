'use strict';

var Get = require('./get');

module.exports = {
    init: (app) => {
        app.get('/print/:url', Get.print);
        app.get('/print', Get.print);
        app.get('/', Get.index);
    }
};