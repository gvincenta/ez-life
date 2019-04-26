import React, { Component } from 'react';

import axios from "axios";
import BudgetList  from './budget/budgetList.jsx';

export default class Budget extends Component {

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
    axios.defaults.headers.common['Authorization'] = this.props.token;
  }
 


  

  
  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value });
    
    console.log(this.state.res);


  }
 
  


  render() {
    
    
  
    return <BudgetList  token = {this.props.token}/>;
  }
}
