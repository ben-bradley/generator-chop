var React = require('react');
var Router = require('react-router');
var Route = Router.Route,
  DefaultRoute = Router.DefaultRoute,
  RouteHandler = Router.RouteHandler,
  Link = Router.Link;

var $ = require('jquery'),
  io = require('socket.io-client'),
  _ = require('lodash');

/**
 * Keep application state here
 */

module.exports = React.createClass({
  getInitialState: function() {
    return {
      models: []
    }
  },
  upsertChecks: function(model) {
    var updated = false;
    var models = this.state.models.map(function(_model) {
      if (_model.id === model.id) {
        updated = true;
        return _.defaults(model, _model);
      }
      return _model;
    });
    if (!updated)
      models.push(model);
    this.setState({
      models: models
    });
  },
  componentDidMount: function () {
    var _this = this;
    // get initial data
    $.getJSON(API + '/models', function (data) {
      _this.setState({
        models: data
      });
    }, function (err) {});
    // connect via socketio
    this.socket = io();
    this.socket.on('model:upserted', function(data) {
      if (_.isArray(data))
        data.forEach(_this.upsertChecks.bind(_this));
      else
        _this.upsertChecks(data);
    });
    // listen for deletes
    this.socket.on('model:deleted', function(data) {
      var models = _this.state.models.filter(function(model) {
        return model.id !== data.deleted;
      });
      _this.setState({ models: models });
    });
  },
  render: function () {
    return <RouteHandler models={this.state.models} />;
  }
});
