'use strict';

var Datastore = require('nedb'),
    db = {};

db.forms = new Datastore({filename: '../release/nedb/forms', autoload: true});

module.exports = {
    insert: (res, collection, doc) => {
        console.log('insert', collection);
        db[collection].insert(doc, function (err, newDoc) {
            res.json(newDoc);
        });
    },

    find: (res, collection, query) => {
        console.log('find', collection);
        db[collection].find(query, function (err, docs) {
            res.json(docs);
        });
    }
};