const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config(); // This allows us to use variables in .env file through process.env
const isProduction = process.env.NODE_ENV === 'production'; // process.env will be used by heroku to provide configs and NODE_ENV will be set to production there.
const history = require('connect-history-api-fallback');

// import all the express routes we will be using
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const businessRouter = require('./routes/businesses');
const messagesRouter = require('./routes/messages');
const mapRouter = require('./routes/map');
// create our app
const app = express();

// set up user session
app.use(session({
  secret: 'safe-samaritan',
  resave: true,
  saveUninitialized: true
}));

// allows us to make requests from POSTMAN
app.use(cors());

// set up the app to use dev logger
app.use(logger('dev'));

// accept json
app.use(express.json());

// https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
// allows object nesting in POST
app.use(express.urlencoded({ extended: false }));

// cookies for sessions
app.use(cookieParser());

// server html+css+js frontend
app.use(history());
app.use(express.static(path.join(__dirname, isProduction ? 'dist' : 'public'))); // in Heroku we want dist but for dev we want public so we don't have to rebuild everytime we change something.

// connect url hierarchies to our routers
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/businesses', businessRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/map', mapRouter);
app.get('*', (req, res) => {
  res.send("Invalid url!");
});

console.log("Running on localhost:3000...");

module.exports = app;
