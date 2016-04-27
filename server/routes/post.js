'use strict';

var phantom = require('phantom');
var fs = require("fs");


//var system = require('system');

module.exports = {
    image2: (req, res) => {
        var filename = "filename.png";
        var base64Data = req.body.file.replace(/^data:image\/png;base64,/, "");

        require("fs").writeFile(filename, base64Data, 'base64', function (err) {
            console.log(err);
        });
    },

    image(req, res) {
        var tempPath = req.files.file.path,
            targetPath = path.resolve('./uploads/image.png');
        if (path.extname(req.files.file.name).toLowerCase() === '.png') {
            fs.rename(tempPath, targetPath, function (err) {
                if (err) throw err;
                console.log("Upload completed!");
            });
        } else {
            fs.unlink(tempPath, function () {
                if (err) throw err;
                console.error("Only .png files are allowed!");
            });
        }

        app.get('/image.png', function (req, res) {
            res.sendfile(path.resolve('./uploads/image.png'));
        });
    }
};

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

