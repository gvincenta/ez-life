import React, { Component } from 'react';

import axios from "axios";
import GoalList  from './goal/goalList.jsx';

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
    axios.defaults.headers.common['Authorization'] =this.props.token;
  }
 
  handleRetrieval = (event) => {
    console.log("get event");

    axios.get('/goals')
      .then(function (response) {
        console.log("get data:" );
        var d = response.data;
        console.log(d );
        this.setState({d });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleUpdate = (event) => {
    console.log("upd event");
    var self = this;

    
    axios.put('/goals', { 
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

  handleAddNew = (event) => {
    console.log("event");

      var self = this;
        axios.post('/goals', {
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

  
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  componentDidUpdate(){
    console.log("didupdate after render!");
    /*if (Object.keys(this.state.res).length !== 0 ){
      console.log("this runs!");

      this.setState({res: {}});
    }*/
  }

  render() {
    console.log(this.props);
    var res;
    console.log("alphabetagamma: ", this.state.submitted);
    
    res =
      (
        <div>
          <GoalList token = {this.props.token} />
        </div>
      )
    ;

   
  
    return res;
  }
}
