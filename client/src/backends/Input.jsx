// taken from: https://stackoverflow.com/questions/31272207/to-call-onchange-event-after-pressing-enter-key
import React, { Component } from 'react';

class Input extends Component {
  

  handleChange(event) {
    this.setState({title: event.target.value})
  }
  render() {
    return <input type='text' name='title' value={this.state.title} 
      onChange={this.handleChange.bind(this)}/>
  }
  };
  export default Input;

