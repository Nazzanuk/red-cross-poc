'use strict';

var phantom = require('phantom');
var fs = require("fs");
var Nedb = require('./../services/nedb');


//var system = require('system');

module.exports = {
    dbInsert(req, res) {
        console.log('getCollection', req.params, req.body);
        Nedb.insert(res, req.params.collection, req.body);
    },

    image: (req, res) => {
        var filename = `signature-${req.body.code}.png`,
            base64Data = req.body.file.replace(/^data:image\/png;base64,/, "");

        require("fs").writeFile(`../release/public/img/${filename}`, base64Data, 'base64', function (err) {
            console.log(err);
            res.send('ok')
        });
    }
};

