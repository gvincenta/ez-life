import React, {Component} from 'react';

import TransItem from './transItem';
import axios from 'axios';

export default class TransList extends Component{
    constructor (props){
        super(props); // mandatory
        this.state = 
          {
            name : "min. 3 characters", 
            date : "YYYY-MM-DD",
            amount: "at least 1",
            transactions: [
              {
                  name:"empty" ,
                  due: "YYYY-MM-DD",
                  amount: 0,
                  _id : "s"
              }
          ],
          error : {}
          }; 
          axios.defaults.baseURL = '/api';
          axios.defaults.headers.common['Authorization'] = this.props.token;
          this.handleLoad();
      }
      handleLoad = ()=>{
        console.log("sad");
        var self = this; 
        axios.get('/transactions')
      .then(function (response) {
        console.log("run");
        var d = response.data;
        console.log("data",d);

        self.setState({transactions: d });

      })
      .catch(function (err) {
        self.setState({error: err});
      });
      console.log(self.state.transactions);
    }


   

    handleAddNew = (event) => {
        event.preventDefault();
       var self = this;
        
        console.log(this.state);
       
          axios.post('/transactions', {
            name : this.state.name,
        realAmount: this.state.amount,
        date : this.state.date
          })
          .then(function (response) {
            console.log(" then response");
            console.log(response.data);
            self.handleLoad();
          })
          .catch(function (err) {
            self.setState({error : err });
          });
          
        }
      

      handleChange (event) {
        this.setState({ [event.target.name]: event.target.value });
        
        console.log(this.state);
      }

    render(){
        const {transactions} = this.state
        return(
            <div>
                 <table className="table table-hover">
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tran,index) => (
                          
                                     
                                    <TransItem key={index} trans ={tran}/>
                                   
                            ))
                        }
                    </tbody>
                </table>
                <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                  Transaction
                </h3>
            </div>
            <div className="panel-body"> 
              <form>
              <label > Name: </label><input type="text" name="name"  />
                  <label > Amount:</label><input type="text" name="realAmount" />
                  <label> Date:</label><input type="text" name="date" />
                  
                  <input type="submit" value="add" onClick={this.handleAddNew}/> 
              </form>
            </div>
 
                {/*<button type="button" className="btn-icon" onClick ={this.handleAddClick}>
                        <Icon name="plus" width={20} fill={"#42778c"} />
                    </button>
                <div style={{display}}>
                    <GoalDetail addGoals={this.addGoals}/>
                    </div>*/}
            </div>
            </div>
            
        )
    }
}