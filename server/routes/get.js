'use strict';

var phantom = require('phantom');

//var system = require('system');

module.exports = {
    print(req, res) {
        var url = req.headers.referer;
        console.log('url', url);

        if (req.query.formData) url = url + '#/?formData=' + req.query.formData;

        console.log('0', url);
        //var page = require('webpage').create();

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
                var ratio = 0.7;

                page.property('viewportSize', {width: 1654 * ratio, height: 2339 * ratio}).then(() => {
                    console.log('setViewportSize');
                    page.open(url).then(function (status) {

                        console.log('status', status);
                        setTimeout(() => {
                            page.render('../release/public/pdf/pdf.pdf').then(() => {
                                //res.download('../release/public/pdf/pdf.pdf'); // Set disposition and send it.
                                res.redirect('/public/pdf/pdf.pdf');
                                phInstance.exit();

                            });
                        }, 500);
                    });
                });
            });
    },
    index(req, res) {
        res.render('index', {title: "Angular Base"});
    }
};

