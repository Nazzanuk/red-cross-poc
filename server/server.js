'use strict';

//npm dependencies
var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser');

//local dependencies
var Routes = require('./routes/routes'),
    Socket = require('./services/socket');

//server setup
var app = express(),
    port = process.env.PORT || 4055,
    server;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('../release'));
app.set('view engine', 'ejs');

server = app.listen(port, () => console.log('Example app listening at http://%s:%s', server.address().address, port));

Socket.start(server);

//define our routes
Routes.init(app);

//in case we need the instance later
module.exports = server;