const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sass = require('node-sass-middleware');

// Routes
const routes = require('./routes/index');
const auth = require('./routes/auth');
const users = require('./routes/users');
const linkPreview = require('./routes/linkPreview');

const app = express();

// Connect to mongodb
var connect = function () {
  var options = {
    server: {
      socketOptions: { keepAlive: 1 }
    }
  };
  mongoose.connect('mongodb://localhost/voicechat_dev', options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
    sass({
        src: __dirname + '/assets/public',
        dest: __dirname + '/assets/dev/public',
        debug: true
    })
);

app.use(express.static(path.join(__dirname, 'assets/dev/public')));
app.use(express.static(path.join(__dirname, 'assets/dev/vendor')));
app.use(express.static(path.join(__dirname, 'assets/public')));
app.use(express.static(path.join(__dirname, 'assets/vendor')));

app.use('/', routes);
app.use('/api/v1', auth); // All following routes require authentication
app.use('/users', users);
app.use('/api/v1', linkPreview);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
