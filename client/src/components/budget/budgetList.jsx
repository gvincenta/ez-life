import React, {Component} from 'react';

import BudgetItem from './budgetItem';
import axios from 'axios';

export default class BudgetList extends Component{
    constructor(props) {
        super(props); // mandatory
        this.state = 
          {
            name : "min. 3 characters", 
            budgetedAmount : 1,
            isIncome: "needs/wants/income",
            preference: 0,
            budgets: [
              {name : "min. 3 characters", 
              budgetedAmount : "minimum 1",
              isIncome: "needs/wants/income",
              preference: "useful for wants, 1 to 10"}
          ],
          error : {}
          }; 
          axios.defaults.baseURL = '/api';
          axios.defaults.headers.common['Authorization'] = this.props.token;
          this.handleLoad();
      }
    
    handleLoad = ()=>{
      var self = this; 
      axios.get('/budget')
      .then(function (response) {
        var d = response.data;
        self.setState({budgets: d });

      })
      .catch(function (err) {
        self.setState({error: err});
      });
    }


   
    
    handleAddNew = (event) => {
        event.preventDefault();
       var self = this;
        
       
          axios.post('/budget', {
            name : self.state.name,
            isIncome: self.state.isIncome,
            preference: self.state.preference
          })
          .then(function (response) {
            self.handleLoad();
          })
          .catch(function (err) {
            self.setState({error : err });
          });
          
    }
      

    handleChange = (event) => {
      event.preventDefault();

        this.setState({ [event.target.name]: event.target.value });

    }
      handlePlan= (event) => {
        event.preventDefault();

          var self = this;
            axios.get('/budget/suggested')
          .then(function (response) {
            self.handleLoad();
          })
          .catch(function (err) {
            self.setState({error : err});
          });
      }
      handleUpdate= (event) =>{
        event.preventDefault();

        var self = this; 
        
        
        axios.put('/budget', {
          name : self.state.name,
          budgetedAmount : self.state.budgetedAmount,
          preference :  self.state.preference
        })
        .then(function (response) {
          self.handleLoad();
        })
        .catch(function (err) {
          self.setState({error : err});
        });
    
      
      }
      handleDelete= (event) =>{
        console.log("handleDelete");

        var self = this; 
        
        axios.delete('/budget', {
          name : self.state.name
        })
        .then(function (response) {
          console.log("response");

          console.log(response);
          self.handleLoad();
        })
        .catch(function (err) {
          console.log("err");
          console.log(err);

          self.setState({error : err});
        });
    
      
      }
    render = () =>{
      console.log(this.state);

        const {budgets} = this.state
       
        return(
            <div>
                 <table className="table table-hover">
                    <thead>
                        <tr>
                        <th>Name: </th>
                        <th>Type: </th>
                        <th>Preference (1 to 10): </th>
                        <th>Budget Amount: </th>

                        </tr>
                    </thead>
                    <tbody>
                        {budgets.map((budget,index) => (
                          
                                     
                                    <BudgetItem key={index} budget ={budget}/>
                                   
                            ))
                        }
                    </tbody>
                </table>
                <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                  Budget Plan
                </h3>
            </div>
            <div className="panel-body"> 
              <form>
             
        <label > Name: </label><input type='text' name='name' value={this.state.name} 
      onChange={this.handleChange}/>
        <label > Type:</label><input type='text' name='isIncome' value={this.state.type} 
      onChange={this.handleChange}/>

        <label> Preference:</label><input type='text' name='preference' value={this.state.preference} 
      onChange={this.handleChange}/>
        <label> Budget Amount:</label><input type='text' name='budgetedAmount' value={this.state.budgetedAmount} 
      onChange={this.handleChange}/>

          <input type="submit" value="update existing" onClick={this.handleUpdate}/>
        <input type="submit" value="plan for next month" onClick={this.handlePlan}/> 
          <input type="submit" value="add new" onClick={this.handleAddNew}/> 
          <input type="submit" value="delete existing " onClick={this.handleDelete}/> 

              </form>
            </div>
 
                
            </div>
            </div>
            
        )
    }
}