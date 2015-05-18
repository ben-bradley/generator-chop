var Hapi = require('hapi'),
  Lout = require('lout'),
  Handlebars = require('handlebars'),
  socketio = require('socket.io'),
  args = require('argify'),
  config = require('config'),
  debug = require('debug')('index');

var server = new Hapi.Server({
  connections: {
    routes: {
      cors: true
    },
    router: {
      stripTrailingSlash: true
    }
  }
});

server.connection(config.connections.api);
server.connection(config.connections.ui);

var api = server.select('api'),
  ui = server.select('ui');

api.route(require('./api/routes'));
ui.route(require('./ui/routes'));

ui.app.io = socketio(ui.listener);
ui.views({
  engines: {
    html: Handlebars
  },
  path: __dirname + '/ui/dist',
  isCached: config.production // true in prd
});

server.register({
  register: Lout
}, function (err) {
  if (err)
    throw new Error(err);
  debug('Plugin loaded: Lout')
});

if (!config.test)
  server.start(function() {
    debug('Server started!');
    console.log('Server listening...');
  });
else
  module.exports = server;
