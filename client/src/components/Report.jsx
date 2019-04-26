import React, { Component } from 'react';
import axios from "axios";

class Report extends Component {

  constructor (props){
    super(props); // mandatory
    this.state = 
    {res : {} }; 
    axios.defaults.baseURL = '/api';
    axios.defaults.headers.common['Authorization'] = this.props.token;
    console.log("token",this.props.token);
  }
 
  handleRetrieval(event){
    console.log("get event");
    var self = this;
    axios.get('/report')
    .then(function (response) {
      console.log("get data:" );
      var d = response.data;
      self.setState({res : d});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  

  componentDidUpdate(){
    
  }


  render() {
    var res;
    console.log("alphabetagammanusia: ");
    
      res = (<div> 
        

  <input type="submit" value="get" onClick={this.handleRetrieval.bind(this)}/> 
  


      </div>)
      
    ;
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

export default Report;
