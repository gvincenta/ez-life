import React, { Component } from 'react';

import TransList from './transaction/transList';

export default class Transaction extends Component {

  constructor (props){
    super(props); // mandatory
    this.state = 
      {
        submitted : false, 
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
    //console.log("asdaada");
    //console.log(event.target.name);
    this.setState({ [event.target.name]: event.target.value });
    
    console.log(this.state);
    /*if (this.state.submitted === false){
      axios.defaults.baseURL = '/api';
      axios.defaults.headers.common['Authorization'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlei1saWZlIiwic3ViIjoiNWNhZWU0OTZlY2EzMTI1NzAxYzk2NjM0IiwiaXNzdWVkQXQiOjE1NTU3MzgyOTA5MDAsImV4cCI6MTU1NTgyNDY5MDkwMCwiaWF0IjoxNTU1NzM4MjkwfQ.xiG-nnntH-srSwylzmNCZhwCXzgmwFqLVQJCvqoD3Vs";
      axios.post('/transactions', {
        name : this.state.name,
    realAmount: this.state.realAmount,
    date : this.state.date
      })
      .then(function (response) {
        console.log(" then response");
        console.log(response.data);
        this.setState({res : response.data});
      })
      .catch(function (error) {
        console.log(error);
      });
      this.setState({ submitted: true });
      
    }*/
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


