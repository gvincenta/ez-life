import React, { Component } from 'react';

import axios from "axios";


export default class Goals extends Component {

  constructor (props){
    super(props); // mandatory
    this.state = 
      {
        submitted : false, 
        name : "",
        amount: 0,
        preference: 0,
        due : "YYYY-MM-DD",
        progress : 0,
        res : {} ,
        type : this.props.value
      }; 
    axios.defaults.baseURL = '/api';
    axios.defaults.headers.common['Authorization'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlei1saWZlIiwic3ViIjoiNWNhZWU0OTZlY2EzMTI1NzAxYzk2NjM0IiwiaXNzdWVkQXQiOjE1NTU3MzgyOTA5MDAsImV4cCI6MTU1NTgyNDY5MDkwMCwiaWF0IjoxNTU1NzM4MjkwfQ.xiG-nnntH-srSwylzmNCZhwCXzgmwFqLVQJCvqoD3Vs";
  }
 
  handleRetrieval(event){
    console.log("get event");

    axios.get('/budget')
        .then(function (response) {
          var d = response.data;
          console.log(d );
          this.setState({d });
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  handleUpdate(event){
    console.log("upd event");
    var self = this;

    
    axios.put('/budget', {
      
      progress: this.state.progress
    })
    .then(function (response) {
      console.log("update data:" );
      var d = response.data;
      console.log(d );
      self.setState({res : d });
    })
    .catch(function (error) {
      console.log(error);
    });
    this.setState({ submitted: true });
    console.log(self.state.res);

  
  }
  handleAddNew(event){
    console.log("event");

      var self = this;
        axios.post('/budget', {
        name: this.state.name,
        amount: this.state.amount,
        preference: this.state.preference,
        due: this.state.due
      })
      .then(function (response) {
        console.log("eres data:" );
        var d = response.data;
        //console.log(d );
        self.setState({res : d}); 
      })
      .catch(function (error) {
        //console.log(error);
      });
      self.setState({ submitted: true });
  }

  
  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value });
    
    console.log(this.state.res);


  }
  componentDidUpdate(){
    console.log("didupdate after render!");
    /*if (Object.keys(this.state.res).length !== 0 ){
      console.log("this runs!");

      this.setState({res: {}});
    }*/
  }
  handlePlan(){
    console.log("event");

      var self = this;
        axios.get('/budget/suggested')
      .then(function (response) {
        console.log("eres data:" );
        var d = response.data;
        //console.log(d );
        self.setState({res : d}); 
      })
      .catch(function (error) {
        //console.log(error);
      });
      self.setState({ submitted: true });
  }


  render() {
    console.log(this.props);
    var res;
    console.log("alphabetagamma: ", this.state.submitted);
    
      res = (<div> 
        
        <label > Name: </label><input type='text' name='name' value={this.state.name} 
      onChange={this.handleChange.bind(this)}/>
        <label > Type:</label><input type='text' name='amount' value={this.state.amount} 
      onChange={this.handleChange.bind(this)}/>

        <label> Preference:</label><input type='text' name='preference' value={this.state.preference} 
      onChange={this.handleChange.bind(this)}/>
       

  <input type="submit" value="add" onClick={this.handleAddNew.bind(this)}/> 
  <input type="submit" value="update" onClick={this.handleUpdate.bind(this)}/>
  <input type="submit" value="get" onClick={this.handleRetrieval.bind(this)}/> 
  <input type="submit" value="plan" onClick={this.handlePlan.bind(this)}/> 



      </div>)
      
    ;
    console.log(Object.keys(this.state.res) );

    if (Object.keys(this.state.res).length !== 0 ){
      var backEnd = JSON.stringify(this.state.res);
      res = (<div> 
              <label > res: </label>
               <label>{backEnd}</label>
      
            </div> );
     
    }
  
    return res;
  }
}
