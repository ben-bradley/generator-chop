var React = require('react');
var RBS = require('react-bootstrap');

module.exports = React.createClass({
  render: function () {
    var trail = [];
    var crumbs = this.props.path.split('/').map(function(c) {
      trail.push(c);
      return <li><a href={'#/' + trail.join('/')}>{c}</a></li>;
    })
    return (
      <RBS.Navbar brand='ESM'>
        <ol className='breadcrumb'>
          <li>
            <a href='#/'>
              <i className='fa fa-home' />
            </a>
          </li>
          {crumbs}
        </ol>
      </RBS.Navbar>
    );
  }
});
