var Models = require('./controller'),
  Boom = require('boom'),
  q = require('q'),
  _ = require('lodash'),
  debug = require('debug')('api.handlers');

module.exports.read = function (request, reply) {
  var id = request.params.id || '';
  debug('GET /models/' + id);
  Models.read(id)
    .then(function (response) {
      if (id)
        debug('GET /models/' + id + ' => ' + JSON.stringify(response));
      else
        debug('GET /models/ => ' + response.length);
      return response
    })
    .catch(function (err) {
      debug('GET /models/' + id + ' => ERROR: ' + err.message);
      return Boom.badRequest(err);
    })
    .done(reply);
}

module.exports.upsert = function (request, reply) {
  var id = request.params.id || '',
    payload = request.payload;

  debug('POST /models/' + id + ' payload => ' + JSON.stringify(payload));

  if (_.isArray(payload) && id.length)
    return reply(Boom.badRequest('Arrays can only be posted to the /models route.'));
  else if (_.isObject(payload) && !_.isArray(payload) && !id.length)
    return reply(Boom.badRequest('Objects must be posted to a path.'));

  if (_.isArray(request.payload)) {
    var promise = q.all(payload.map(Models.update));
  } else if (_.isObject(payload)) {
    if (id.length)
      payload.id = id;
    var promise = Models.update(payload);
  } else {
    debug('Unhandled POST error: ' + JSON.stringify({
      payload: payload,
      id: id
    }));
    return reply(Boom.badRequest('Unhandled error, model the debug logs'));
  }

  promise
    .then(function (response) {
      if (id)
        debug(request.method + ' /models/' + id + ' => ' + JSON.stringify(response));
      else
        debug(request.method + ' /models/ => ' + response.length);
      return response;
    })
    .then(io(request, 'upserted'))
    .catch(function (err) {
      debug(request.method + ' /models/' + id + ' => ERROR: ' + err.message);
      return Boom.badRequest(err);
    })
    .done(reply);
}

module.exports.del = function(request, reply) {
  var id = request.params.id;
  debug('DELETE /models/' + id);
  Models.del(id)
    .then(io(request, 'deleted'))
    .catch(function (err) {
      debug('DELETE /models/' + id + ' => ERROR: ' + err.message);
      return Boom.badRequest(err);
    })
    .done(reply);
}

function io(request, action) {
  return function(result) {
    var io = request.server.select('ui').app.io;
    if (io && io.emit) {
      debug('emitting: ' + action + ' ' + JSON.stringify(result));
      io.emit('model:' + action, result);
    } else {
      debug('no IO found: ' + request.server.select('ui').app);
    }
    return result;
  }
}
