var React = require('react');

module.exports = React.createClass({
  render: function () {
    var models = this.props.models,
      path = this.props.path;

    return (
      <div className='container-fluid'>
        <pre>{JSON.stringify(models, null, 2)}</pre>
      </div>
    );
  }
});
