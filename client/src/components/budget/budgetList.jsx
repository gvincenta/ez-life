import React, {Component} from 'react';

import BudgetItem from './budgetItem';
import axios from 'axios';
import PlanItem from './planItem';
//handles making categories and budget planning
export default class BudgetList extends Component{
    constructor(props) {
        super(props); // mandatory
        this.state = 
          {
            name : "", 
            budgetedAmount : null,
            isIncome: "",
            preference: null,
            budgets: [
              {name : "min. 3 characters", 
              budgetedAmount : "minimum 1",
              isIncome: "needs/wants/income",
              preference: "useful for wants, 1 to 10"}
          ],
          error : {},
          response : 0
          }; 
          axios.defaults.baseURL = '/api';
          axios.defaults.headers.common['Authorization'] = this.props.token;
          this.handleLoad();
      }
    //handle item loading: 
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


   
    //handle adding more categories, 
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
      
    //handles changes to each input field
    handleChange = (event) => {
      event.preventDefault();

        this.setState({ [event.target.name]: event.target.value });

    }
    //handles budget planning for next month: 
      handlePlan= (event) => {
        event.preventDefault();

          var self = this;
            axios.get('/budget/suggested')
          .then(function (res) {
            self.setState({response : res.data});
          })
          .catch(function (err) {
            self.setState({error : err});
          });
      }
      //handles updating budget amounts: 
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
      //handles deleting a  category: 
      handleDelete = (event) => {
        event.preventDefault();
       var self = this;
        
          axios.delete('/budget', {
            data: 
            {name : self.state.name}
            
          })
          .then(function (response) {
            self.handleLoad();
          })
          .catch(function (err) {
            self.setState({error : err });
          });
          
    }
    // renders category table + category input's fields : 
    render = () =>{

        const {budgets} = this.state
       var res;

       if (this.state.response === 0){
          res = (
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
             
        <label > Name: </label><input type='text' name='name' value={this.state.name} placeholder="min. 3 characters"
      onChange={this.handleChange}/>
        <label > Type:</label><input type='text' name='isIncome' value={this.state.type} placeholder=""
      onChange={this.handleChange}/>

        <label> Preference:</label><input type='text' name='preference' value={this.state.preference} placeholder="1 to 10"
      onChange={this.handleChange}/>
        <label> Budget Amount:</label><input type='text' name='budgetedAmount' value={this.state.budgetedAmount} placeholder="minimum 1"
      onChange={this.handleChange}/>

          <input type="submit" value="update existing" onClick={this.handleUpdate}/>
        <input type="submit" value="plan for next month" onClick={this.handlePlan}/> 
          <input type="submit" value="add new" onClick={this.handleAddNew}/> 
          <input type="submit" value="delete existing " onClick={this.handleDelete}/> 

              </form>
            </div>
 
                
            </div>
            </div>
            
        );
       }
       else{
         var plans = JSON.stringify(this.state.response);
         res = (<div> 
            <table className="table table-hover">
                    <thead>
                        <tr>
                        <th>Name: </th>
                        <th>Type: </th>
                        <th>Preference (1 to 10): </th>
                        <th>Suggested Amount: </th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.response.map((res,index) => (
                          
                                     
                                    <PlanItem key={index} result ={res}/>
                                   
                            ))
                        }
                    </tbody>
                </table>
         </div>);
       }
        return res; 
    }
}