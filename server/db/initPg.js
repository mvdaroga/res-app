module.exports = function initPg(config) {
  'use strict';
  return new Promise(function initPgCb(resolve, reject) {
    const Sequelize = require('sequelize');
    const sequelize = new Sequelize(config.dbUrl, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: config.dbSsl ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      pool: {
        max: config.poolMax ? config.poolMax: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      logging: config.dbLogging,
      define: {
        timestamps: false,
        freezeTableName: true
      },
      timezone: '+03:00'
    });

    sequelize.authenticate().then(() => {
      const db = require('../models')(sequelize, Sequelize);
      resolve(db);
      console.info('Database connection successfully.');
    }).catch(e => reject(e));
  });
};
