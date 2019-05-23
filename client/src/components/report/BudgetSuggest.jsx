import React, { Component } from "react";

export default class BudgetSuggest extends Component {
    constructor(props) {
        super(props); // mandatory

        this.state = {
          response : []
          
        };
        this.handleLoad()
      }
      //handles budget planning for next month:
      handleLoad = () => {

        var self = this;
        this.props.axios
      .get("/budget/suggested")
      .then(function(res) {
        self.setState({ response: res.data });
      })
      .catch(function(err) {
        self.setState({ error: err });
      });
  };
      render(){
          var {response} = this.state;
          
          return (<div className="col-xs-6">{(response.length > 0)
            ? <div className="table responsive">
                   <table class="table">
                     <thead>
                       <tr>
                         <th width = {120}> Budget Category</th>
                         <th width = {200}>Suggested Amount</th>
                         
                       </tr>
                     </thead>
                     <tbody>
                     {response.map((item, index) => (
                        
                        <tr>
                          
                        <td  >{item.name}</td>
                        <td >{item.budgetedAmount}</td>
                      </tr>
                      ))}
                      
                       
           
                     </tbody>
                   </table>
           
                 </div>
           :  <div> No budget suggestions found for this Month <hr/> </div>} </div>);
      }
}