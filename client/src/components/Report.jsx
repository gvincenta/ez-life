import React, { Component } from 'react';
import axios from "axios";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Goals from './Goals';
/**Handles monthly report for client. */
class Report extends Component {

  constructor (props){
    super(props); // mandatory
    this.state = 
    {res : {} }; 
    axios.defaults.baseURL = '/api';
    axios.defaults.headers.common['Authorization'] = this.props.token;
  }
  /**Generates monthly report from backend. */

  handleRetrieval(event){
    var self = this;
    axios.get('/report')
    .then(function (response) {
      var d = response.data;
      self.setState({res : d});
    })
    .catch(function (error) {
      alert(error);
    });
  }



  render() {
    var res;
    //displays button if not yet clicked: 
      res = (<div> 
        

  <input type="submit" value="get" onClick={this.handleRetrieval.bind(this)}/> 
  


      </div>);

    //displays spending per category, net income, and instructions on what to do with goals: 
    if (Object.keys(this.state.res).length !== 0 ){
      var len = this.state.res.length -1 ;
      var arr = this.state.res.slice(0,len);
      var remain = this.state.res[this.state.res.length -1];
      var backEnd = JSON.stringify(arr);
      var cols = [{  Header: 'Name',
                  accessor: 'name' },
                  {  Header: 'Total Amount Spent/Received',
                  accessor: 'totalAmount' },
                {Header: "Type",
                accessor: 'isIncome' }];
      var msg = "Neither loses or savings made. here are your goals: ";
    if (remain > 0){
      msg =  "Nice save! please assign these remaining to your goals:";
    }
    else if (remain < 0 ){
      msg = "OH no! you've made losses! please accomodate these losses by taking away your long term saving or emergency funds:";
    }
    res =  (<div> 
     
      <ReactTable data={arr} columns = {cols} minRows = {len}/>
      <br /> 
      <h2> Your Remaining Balance For this {new Intl.DateTimeFormat('en-US', { month: 'long'}).format(new Date())} : {remain} </h2>
      <br /> 
      <h2> {msg} </h2>
      <Goals token={this.props.token}/>
    </div> );

    }
      return res; 
  
    
  }
}

export default Report;
