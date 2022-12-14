var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const port = process.env.PORT || 8080;

// var indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const artworkRouter = require('./routes/artwork');
const promptRouter = require('./routes/prompt');
const userRouter = require('./routes/user');
const smsRouter = require('./routes/sms');

var app = express();

app.use(logger('dev'));
app.use(express.json({ limit: '5MB' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// For the restful api
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
     'Access-Control-Allow-Methods',
     'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
     'Access-Control-Allow-Headers',
     'Content-Type, Authorization'
  );
  next();
}
);

// app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/artwork', artworkRouter);
app.use('/prompt', promptRouter);
app.use('/user', userRouter);
app.use('/sms', smsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(error, req, res, next) {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(port, () => {
  console.log('App is up and running');
});

module.exports = app;
