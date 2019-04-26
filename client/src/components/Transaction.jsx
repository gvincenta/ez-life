import React, { Component } from 'react';

import TransList from './transaction/transList';

export default class Transaction extends Component {

  constructor (props){
    super(props); // mandatory
    this.state = 
      {
        name : "",
        realAmount: 0,
        date : new Date(),
        res : {} 
      }; 
  }

  handleRetrieval = (event) => {

  }
  
  handleAddNew = (event) => {
    event.preventDefault();

    this.setState({ [event.target.name]: event.target.value });
    
    console.log(this.state);
    
  }

  

  
  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value });
    
    console.log(this.state);
  }
  
  render() {
    var res;
    console.log("each refresh state is: ", this.state.submitted);
    if (this.state.submitted === false){
      res =
        (
          <div>
            <TransList  token = {this.props.token} />

          </div>
         
        );
    } 
    return res;
  }
}


