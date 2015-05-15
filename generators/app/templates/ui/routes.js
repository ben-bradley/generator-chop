var debug = require('debug')('ui.routes');

module.exports = [{
  method: 'get',
  path: '/',
  handler: function (request, reply) {
    debug('request for index.html');
    reply.view('index', {
      api: request.server.select('api').info.uri,
      ts: new Date().getTime()
    });
  }
}, {
  method: 'get',
  path: '/{p*}',
  handler: {
    directory: {
      path: __dirname + '/dist'
    }
  }
}];
