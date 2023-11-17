module.exports = (app, config)=> {
  'use strict';
  const
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    multer = require('multer'),
    helmet = require('helmet'),
    timeout = require('express-timeout-handler');

  const options = {
    timeout: 27000,
    onTimeout: function (req, res) {
      res.status(503).end();
    }
  };

  app.use(timeout.handler(options));
  app.use(compression());

  if ('dev' === config.env) {
    app.use(helmet({
      contentSecurityPolicy: false
    }));
  } else {
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", 'data:'],
          baseUri: ["'self'"],
          blockAllMixedContent: [],
          connectSrc: ["'self'", 'data:', 'https:', 'ws://localhost:8001'],
          fontSrc: ["'self'", 'https:'],
          frameAncestors: ['self'],
          frameSrc: ['blob:'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          objectSrc: ["'self'", 'blob:'],
          scriptSrc: ["'self'", "data:", "'unsafe-inline'"], // test firefox
          scriptSrcAttr: ['none', "'unsafe-inline'"],
          scriptSrcElem: ["'self'", 'data:', "'unsafe-inline'", "'unsafe-eval'", 'https:'],
          styleSrc: ["'self'", "data:", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrcElem: ["'self'", "data:", "'unsafe-inline'", "'unsafe-eval'", 'https:'],
          upgradeInsecureRequests: []
        },
        reportOnly: false
      }
    }));
  }
  app.disable('x-powered-by');
  app.use(multer({dest:'./tempReports/'}).any());
  app.use(bodyParser.json({limit: '10mb'}));
  app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
  app.use(cookieParser());
  app.use(morgan('dev'));
};
