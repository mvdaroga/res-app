module.exports = app => {
  'use strict';
  const express         = require('express');
  const peopleCtrl = require('../controllers/peopleCtrl')(app.locals.db);
  const router          = express.Router();

  router.post('/', peopleCtrl.create);
  router.put('/', peopleCtrl.update);
  router.get('/', peopleCtrl.findAll);
  router.get('/:id', peopleCtrl.find);
  router.delete('/:id', peopleCtrl.destroy);

  return router;
};
