'use strict';

var converter = require('json-2-csv'),
    phantom = require('phantom'),
    fs = require("fs");

var Socket = require('./../services/socket'),
    Nedb = require('./../services/nedb'),
    OCD = require("../services/ocd");

module.exports = {
    getCSV (req, res) {
        Nedb.find(req.params.collection).then((docs) => converter.json2csv(docs, (err, csv) => {
            console.log('generated csv', csv);
            res.setHeader('Content-disposition', `attachment; filename=red-cross-forms.csv`);
            res.contentType("application/csv; charset=UTF-8");
            res.send(csv)
        }));
    },

    dbCollection (req, res) {
        Nedb.find(req.params.collection).then((docs) => res.json(docs));
    },

    print (req, res) {
        var url = req.headers.referer, now = Date.now(), ratio = 0.7, formData = JSON.parse(req.query.formData);
        var imageFileName = `signature-${formData.signatureCode}.png`;
        var sitepage = null, phInstance = null;

        formData.savedImage = imageFileName;
        if (req.query.formData) url = url + '#/form/?formData=' + JSON.stringify(formData);
        delete formData.signature;

        console.log('formData', formData);

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
                        console.log('Rendered Page - ' + `../release/public/pdf/form-${now}.pdf`);
                        res.send({formUrl: `/public/pdf/form-${now}.pdf`});
                        OCD.upload(`../release/public/pdf/form-${now}.pdf`, `form-${now}.pdf`);
                        phInstance.exit();
                        Socket.broadcast('alert', {content: `New form submitted by ${formData.firstName} ${formData.lastName}`})
                    });
                }, 1500);
            });

    },

    index (req, res) {
        res.render('index', {title: "Red Cross POC"});
    }
};
