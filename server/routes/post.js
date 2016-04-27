'use strict';

var phantom = require('phantom');
var fs = require("fs");


//var system = require('system');

module.exports = {
    image: (req, res) => {
        var filename = `signature-${req.body.code}.png`,
            base64Data = req.body.file.replace(/^data:image\/png;base64,/, "");

        require("fs").writeFile(`../release/public/img/${filename}`, base64Data, 'base64', function (err) {
            console.log(err);
            res.send('ok')
        });
    }
};

