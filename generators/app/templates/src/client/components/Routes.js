var React = require('react');
var Router = require('react-router');
var Route = Router.Route,
  DefaultRoute = Router.DefaultRoute,
  NotFoundRoute = Router.NotFoundRoute,
  RouteHandler = Router.RouteHandler,
  Link = Router.Link;

var App = require('./App'),
  Main = require('./Main');

module.exports = (
  <Route handler={App}>
    <DefaultRoute handler={Main}/>
    <Route path='/*' handler={Main}/>
    <NotFoundRoute handler={Main}/>
  </Route>
)

//    <!-- <Route name="dashboard" handler={Dashboard}/> -->
