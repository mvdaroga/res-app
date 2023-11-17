module.exports = {
  init: function initConfig() {
    require('with-env')();

    const _    = require('lodash');
    const path = require('path');
    const conf = require('konfig')();
    const rawConf = _.pick(conf, ['common',  conf.common.env || process.env ]);
    const G = {};

    G.config = _.extend({}, rawConf.common, rawConf[conf.common.env] || process.env );
    G.config.path = path.normalize(__dirname + '/../../');

    return G.config;
  }
};
