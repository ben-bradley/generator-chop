var Boom = require('boom'),
  handlers = require('./api.handlers'),
  debug = require('debug')('api.routes');

module.exports = [{
  method: 'get',
  path: '/models/{id*}',
  config: {
    description: 'This route returns models matching {id*} that are currently in memory',
    handler: handlers.read
  }
}, {
  method: 'post',
  path: '/models/{id*}',
  config: {
    description: 'This route allows for upserting models',
    handler: handlers.upsert
  }
}, {
  method: 'put',
  path: '/models/{id*}',
  config: {
    description: 'This route allows for upserting models',
    handler: handlers.upsert
  }
}, {
  method: 'delete',
  path: '/models/{id*}',
  config: {
    description: 'This route allows for deleting models',
    handler: handlers.del
  }
}];
