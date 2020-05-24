var express = require('express');
var router = require('./routes/routes.js')
var path = require('path');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));

app.use(express.static(path.join(__dirname, '../client')));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

mongoose.connect('mongodb://127.0.0.1:27017/kanban', { useNewUrlParser: true });

app.use('/', router);

module.exports=app;