const config         = require('./init/config').init();
const PORT           = process.env.PORT || 8080;
const app            = require("express")();
const cors           = { origin: "http://localhost:3000", methods: ["GET", "POST"], transports: ['websocket'], credentials: true };
const server         = require('http').createServer(app);
const io             = require('socket.io')(server, {'transports': ['websocket'], pingInterval: 15000, pingTimeout: 30000, cors: config.env === 'dev' ? cors : {}, allowEIO3: config.env === 'dev' ? true : false});
const redis          = require('socket.io-redis');
const pg             = require('./db/initPg');
const phantomInit    = require('./init/phantomInit');

process.env.TZ = 'Europe/Bucharest';
global.NODE_ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
global.config = config;

io.adapter(redis(process.env.REDIS_URL));

Promise.all([pg(config), phantomInit.createPhantomSession(app)]).then(values => {
  app.locals.config = config;
  app.locals.db = values[0];
  app.locals.ph = values[1];
  app.io = io;

  require('./init/express')(app, config);
  require('./routes')(app);

  io.of('/').adapter.on('error', err => console.error('ERROR no redis server', err));

  server.listen(PORT, config.ip, () => {
    console.info('Listening on port: %d, env: %s', PORT, config.env);
    process.on('exit', () => {
      console.info('exiting phantom session');
      app.locals.ph.exit();
    });
  });
}).catch(e => console.error('Init sequence error: ', e));