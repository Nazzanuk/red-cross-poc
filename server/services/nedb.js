'use strict';

var Datastore = require('nedb'), db = {};
var Promise = require('promise');

db.forms = new Datastore({filename: '../release/nedb/forms', autoload: true});

module.exports = {
    insert: (collection, doc) => {
        return new Promise((resolve, reject) => {
            console.log('insert', collection);
            db[collection].insert(doc, function (err, docs) {
                resolve(docs);
            });
        });
    },

    find: (collection, query) => {
        return new Promise((resolve, reject) => {
            console.log('find', collection);
            db[collection].find(query, function (err, docs) {
                resolve(docs);
            });
        });
    }
};