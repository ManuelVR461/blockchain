const express = require('express');
const i18n = require('i18n');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');

// our in-house dependency injection framework
const DI = require('./di');
const core = require('./core');
const routes = require('./routes');
const modules = require('./modules');
const {Logger, Error} = require('./helpers');

// init i18n
i18n.configure({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  directory: path.join(__dirname, 'locales'),
});

// init app
const app = express();

// init dependency injection
// register modules with respective namespace
// module then can be accessible via res.locals.namespace within the controller
app.use(DI([
  {module: modules.blockchain, namespace: 'blockchain'},
], () => {
  // fire app.ready
  // do it in next iteration to avoid server from not picking up the event
  process.nextTick(() => app.emit('ready'));
}));

// interception start for sentry
app.use(core.sentry.interceptBegin());

// set up winston logger as middleware
app.use(expressWinston.logger({
  winstonInstance: Logger,
  // no pre-build meta
  meta: false,
  msg: 'HTTP REQUEST {{req.ip}} - {{res.statusCode}} - {{req.method}} - {{res.responseTime}}ms - {{req.url}} - {{req.headers[\'user-agent\']}}',
  // use the default express/morgan request formatting
  // enabling this will override any msg if true
  expressFormat: false,
  // force colorize when using custom msg
  colorize: true,
  // set log level according to response status
  statusLevels: true,
}));

// set up cookie parser
app.use(cookieParser());

// set up serving of static files
app.use(express.static(path.join(__dirname, 'public')));

// set up i18n
app.use(i18n.init);

// parse application/x-www-form-urlencoded payload
app.use(bodyParser.urlencoded({
  extended: false,
}));

// parse application/json payload
app.use(bodyParser.json());

// add headers
app.use((req, res, next) => {
  // website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept');
  // set to true if you need the website to include cookies in the requests sent
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// set up routes
app.use('/blocks', routes.blocks);
app.use('/transactions', routes.transactions);
app.use('/wallet', routes.wallet);

// not found handler
app.use((req, res, next) => {
  next(Error.NotFound());
});

// error handler for handled error
app.use((err, req, res, next) => {
  if (Error.isHandled(err)) {
    // handled error
    res.status(err.api_status);
    res.send({
      error: err.message || res.__(`DEFAULT_ERRORS.${err.locale_tag}`),
      error_code: err.api_code,
    });
  } else {
    // un-handled error
    res.status(500);
    res.send({
      error: res.__('DEFAULT_ERRORS.SERVER_ERROR'),
      error_code: 'server_error',
    });
    // continue to next error handler
    next(err);
  }
});

// interception end for sentry
app.use(core.sentry.interceptEnd());

// error logging via winston
app.use(expressWinston.errorLogger({
  winstonInstance: Logger,
}));

module.exports = app;
