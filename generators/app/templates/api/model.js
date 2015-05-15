var uuid = require('uuid'),
  _ = require('lodash'),
  debug = require('debug')('api.model');

function Model(model, doValidation) {
  doValidation = doValidation || true;
  var defaults = {
    id: 'random/' + uuid.v4(),
    value: '?',
    status: 'init',
    description: 'default description',
    created: new Date(),
    updated: new Date(),
    updates: 0
  };
  model = _.defaults(model, defaults);
  debug('new model: ' + JSON.stringify(model));
  if (doValidation)
    return validate(model);
  return model;
}

function validate(model) {
  // validate the .id
  if (!model.id)
    throw new Error('No id property: ' + JSON.stringify(model));
  else if (!_.isString(model.id))
    throw new Error('The id must be a string.');
  else if (/^\W/.test(model.id)) // .id must begin w/ a letter or number
    throw new Error('Invalid characters in id.');

  // validate the .statuses
  var statuses = ['init', 'pass', 'warn', 'fail', 'info'];
  if (statuses.indexOf(model.status) < 0)
    throw new Error('Invalid status: ' + model.status + ', valid options are: ' + statuses.join());

  // validate the .value
  if (!_.isString(model.value) && !_.isNumber(model.value))
    throw new Error('Value must be a string or number.');

  // description
  if (!_.isString(model.description))
    throw new Error('Description must be a string.');

  // created
  if (!_.isDate(model.created) && !_.isDate(new Date(model.created)))
    throw new Error('Created must be a date.');

  // updated
  if (!_.isDate(model.updated) && !_.isDate(new Date(model.updated)))
    throw new Error('Updated must be a date.');

  // updates
  if (!_.isNumber(model.updates))
    throw new Error('Updates must be a number.');

  return model;
}

module.exports = Model;
module.exports.validate = validate;
