const express = require('express');
const exprHbs = require('express-handlebars');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const store = require('./mongodb-session');
const helpers = require('./handlebar-helpers');
require('dotenv').config();

const app = express();
//setting up the middleware for serving static resources
app.use('/static', express.static('assets'));
app.use('/user_images', express.static('user_images'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//setting up express-session middleware and using MongoDB as a store
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 300000 },
    resave: true,
    saveUninitialized: true,
    store: store,
  })
);
//setting up express-fileUpload middleware
app.use(
  fileUpload({
    tempFileDir: '/tmp/',
    useTempFiles: true,
  })
);
//middleware to stop cross-user access
app.use('/student', (req, res, next) => {
  if (req.session.user_role === 'admin') res.redirect('/admin/dashboard');
  else next();
});
app.use('/admin', (req, res, next) => {
  if (req.session.user_role === 'student') res.redirect('/student/');
  else next();
});

//setting up the view engine for server-side rendering
app.engine('handlebars', exprHbs({ helpers: helpers }));
app.set('view engine', 'handlebars');

//setting up the routes
app.use('/', require('./routes/home.route'));
app.use('/student', require('./routes/student.route'));
app.use('/admin', require('./routes/admin.route'));

//Handling Errors through custom Error Function
app.use((err, req, res, next) => res.redirect('/error'));

//for handling invalid requests
app.all('*', (req, res) => res.redirect('/error'));
module.exports = app;
