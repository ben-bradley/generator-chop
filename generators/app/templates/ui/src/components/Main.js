var React = require('react');

var Toolbar = require('./Toolbar'),
  Content = require('./Content');

module.exports = React.createClass({
  render: function () {
    var path = this.props.params.splat,
      models = this.props.models;
    return (
      <div>
        <Toolbar path={path} />
        <Content path={path} models={models} />
      </div>
    );
  }
});
