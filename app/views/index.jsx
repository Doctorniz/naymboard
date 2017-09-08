var React = require('react');
var DefaultLayout = require('./layouts/default');

class HelloMessage extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.state = {
      count: 1
    }
  }
  onClick(e) {
    
    console.log(e);
    let count = this.state.count + 1;
    
    this.setState ({ count })
  }
  render() {
    return (
      <DefaultLayout title={this.props.title}>
        
        <div>Hello {this.props.name} {this.state.count} </div>
        <button onClick={ }> Add </button>
      </DefaultLayout>
    );
  }
}

module.exports = HelloMessage;