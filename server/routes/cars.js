module.exports = app => {
  'use strict';
  const express         = require('express');
  const carsCtrl = require('../controllers/carsCtrl')(app.locals.db);
  const router          = express.Router();

  router.post('/', carsCtrl.create);
  router.put('/', carsCtrl.update);
  router.get('/', carsCtrl.findAll);
  router.get('/:id', carsCtrl.find);
  router.delete('/:id', carsCtrl.destroy);

  return router;
};
