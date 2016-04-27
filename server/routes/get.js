'use strict';

var phantom = require('phantom');
var fs = require("fs");


//var system = require('system');

module.exports = {
    print(req, res) {
        var url = req.headers.referer, now = Date.now(), ratio = 0.7, formData = JSON.parse(req.query.formData);
        var imageFileName = `signature-${now}.png`, signature;;

        formData.savedImage = imageFileName;

        if (req.query.formData) {
            signature = formData.signature;
            delete formData.signature;
            url = url + '#/?formData=' + JSON.stringify(formData);
        }

        console.log('formData', formData);

        if (signature) {
            let base64Data = signature.replace(/^data:image\/png;base64,/, "");

            require("fs").writeFile(`../release/public/img/${imageFileName}`, base64Data, 'base64', function (err) {
                console.log(err);
            });
        }


        var sitepage = null;
        var phInstance = null;
        //
        phantom.create()
            .then(instance => {
                phInstance = instance;
                return instance.createPage();
            })
            .then(page => {
                sitepage = page;
                return page.property('viewportSize', {width: 1654 * ratio, height: 2339 * ratio});
            })
            .then(() => {
                console.log('setViewportSize');
                sitepage.open(url)
            })
            .then((status) => {
                console.log('status', status);
                setTimeout(() => {
                    sitepage.render(`../release/public/pdf/form-${now}.pdf`).then(() => {
                        //res.download('../release/public/pdf/pdf.pdf'); // Set disposition and send it.
                        res.redirect(`/public/pdf/form-${now}.pdf`);
                        phInstance.exit();
                    });
                }, 800);
            });

    },

    index(req, res) {
        res.render('index', {title: "Red Cross POC"});
    }
};

