'use strict';

var fs = require("fs"), request = require('request');

var user = "odcs.dev1@vassit.co.uk", pass = "Vassit1234",
    url = "https://vassit2015-gbvassitservi00618.documents.us2.oraclecloud.com/documents/api/1.1/files/data",
    parentID = "FAF85E93D11BB6AEFDCBCF6FF9BD3A2A989DD2119B94";

module.exports = {
    upload: (fileLocation, fileName) => {
        console.log('OCD.uploading', fileLocation);

        let obj = {method: 'POST', url, auth: {user, pass}};

        console.log('uploading...');
        var r = request.post(obj, (error, response, body) => {
            if (error) console.log('upload failed:', error);
            else console.log('Upload successful!  Server responded with:', body);
        });

        var form = r.form();

        form.append('jsonInputParameters', JSON.stringify({parentID}));
        form.append('primaryFile', fs.createReadStream(fileLocation), {
            filename: fileName,
            contentType: 'application/pdf'
        });
    }
};