const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const expJwt = require('express-jwt');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const teamFeedRouter = require('./routes/teamFeed');

const tokenManager = require('./authentication/tokenManager');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000'
}));

tokenManager.getSecret((err, secr) => {
  app.use(
    expJwt({
      secret: secr,
      getToken: req => req.cookies.token,
      algorithms: ['HS256']
    }).unless({
      path: [
        '/login',
        /\/users\/username\/.*/,
        {
          url: '/users',
          methods: ['POST']
        },
        // '/teamfeed'
      ]
    })
  )
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/teamfeed', teamFeedRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
