module.exports = function getModels(sequelize, Sequelize) {
  'use strict';

  const _ = require('lodash');
  const fs = require('fs');
  const path = require('path');

  const fileTree = [];

  function getFilesRecursive(folder) {
    const fileContents = fs.readdirSync(folder);
    let stats;

    fileContents.forEach(function (fileName) {
      stats = fs.lstatSync(folder + '/' + fileName);

      if (stats.isDirectory()) {
        getFilesRecursive(folder + '/' + fileName);
      } else {
        if (((fileName.indexOf('.') !== 0) && (fileName !== 'index.js') && (fileName.slice(-3) === '.js'))) {
          fileTree.push(folder + '/' + fileName);
        }
      }
    });

    return fileTree;
  }

  getFilesRecursive(__dirname);

  const arr = [
    /************************ Information *********************/
    {path: __dirname + '/information.js', sync: true},
    {path: __dirname + '/people.js', sync: true},
    {path: __dirname + '/cars.js', sync: true},
  ];

  const syncTables = [];

  _.each(arr, file => {
    if (file.sync && process.env.RUN_CRON === 'true') {
      const model = require(path.join(file.path))(sequelize, Sequelize);
      syncTables.push(model);
    } else {
      require(path.join(file.path))(sequelize, Sequelize);
    }
  });

  for (let i = 0; i < fileTree.length; i++) {
    const tmp = arr.find(r => r.path === fileTree[i]);

    if (!tmp) {
      const model = require(fileTree[i])(sequelize, Sequelize);
      let modelName = fileTree[i].substring(fileTree[i].lastIndexOf('/') + 1, fileTree[i].indexOf('.js'));
      modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
      console.error('Nu este introdusă ruta pentru modelul: ' + modelName);

      syncTables.push(model);
    }
  }

  if (syncTables.length && process.env.RUN_CRON === 'true') {
    _.each(syncTables, file => {
      console.info(file);
      file.sync({alter: true, logging: false});
    });
  }

  return sequelize;
};