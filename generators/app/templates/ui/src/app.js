var React = require('react');
var Router = require('react-router');

var routes = require('./components/Routes');

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});
