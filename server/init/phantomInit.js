exports.createPhantomSession = app => {
  'use strict';

  if (app.locals.ph) {
    return Promise.resolve(app.locals.ph);
  } else {
    const phantom = require('phantom');

    return phantom.create([], {
      dnodeOpts: {weak: false},
      parameters: {'web-security': 'no'}
    });
  }
};
