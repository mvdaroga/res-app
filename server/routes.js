module.exports = app => {
  'use strict';
  const express      = require("express");
  const appPath      = __dirname + '/../client';
  const path         = require('path');
  const errors       = require('./errors');

  /* LOGIN */
  app.use('/api/information', require('./routes/information')(app));
  app.use('/api/people', require('./routes/people')(app));
  app.use('/api/cars', require('./routes/cars')(app));

  app.route('*/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);

  /* BUILD */
  app.use(express.static(path.join(appPath, 'dist/client')));
  app.get('/*', (req, res) => res.sendFile(path.join(appPath, 'dist/client', 'index.html')));

  app.route('*').get(errors[404]);
};
