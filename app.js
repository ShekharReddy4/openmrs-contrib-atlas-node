// variables
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var morgan = require('morgan');
var uuid = require('uuid');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// favicon setup 
app.use(favicon(path.join('public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));     //this package logs the requests and errors in the console (needed for dev not intended for production purpose)

//auth middleware
app.use(cookieParser());
app.use(expressSession(
    {
        secret: process.env.SESSION_SECRET || 'secret',
        saveUninitialized:false,
        resave:false
    }));

// routes
var db = require('./db');

var routes = require('./routes/index');
routes(app, db);

module.exports = app;