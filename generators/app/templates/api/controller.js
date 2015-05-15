var q = require('q'),
  _ = require('lodash'),
  LRU = require('lru-cache'),
  debug = require('debug')('api.controller'),
  Model = require('./model');

var Promise = q.Promise;

var models = LRU();

var create = module.exports.create = function create(model) {
  return Promise(function (resolve, reject) {
    model = new Model(model);
    models.set(model.id, model);
    debug('creating: ' + JSON.stringify(model));
    resolve(model);
  });
}

var read = module.exports.read = function read(id) {
  return Promise(function (resolve, reject) {
    debug('reading: ' + id);
    if (!id)
      return resolve(models.values());
    else if (id && models.has(id))
      return resolve(models.get(id));
    return resolve([]);
  });
}

var update = module.exports.update = function update(model) {
  return Promise(function(resolve, reject) {
    if (!model.id)
      return reject(new Error('Update failed: no id on model.'));
    else if (!models.has(model.id)) // upsert
      return create(model).then(resolve).catch(reject);
    model = _.defaults(model, models.get(model.id));
    model.updates += 1;
    model.updated = new Date();
    models.set(model.id, model);
    debug('updating: ' + JSON.stringify(model));
    resolve(model);
  });
}

var del = module.exports.del = function del(model) {
  return Promise(function(resolve, reject) {
    var id = (model.id) ? model.id : model;
    debug('deleting: ' + id);
    if (!_.isString(id))
      return reject(new Error('Invalid id: ' + id));
    else if (!models.has(id))
      return resolve({
        deleted: null
      });
    models.del(id);
    resolve({
      deleted: id
    });
  });
}
