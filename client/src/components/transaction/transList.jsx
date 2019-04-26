import React, {Component} from 'react';

import TransItem from './transItem';
import axios from 'axios';
/**TransList, a class to render all transaction's lists.  */
export default class TransList extends Component{
   /** init object
    * @params this.props: needs user's token for axios to make requests to backend.
   */
    constructor (props){
        super(props); 
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
       var self = this; 
        axios.get('/transactions')
      .then(function (response) {
        var d = response.data;

        self.setState({transactions: d });

      })
      .catch(function (err) {
        self.setState({error: err});
      });
    }

   /** handle 1 field's change: */
    handleChange = (event) => {
      event.preventDefault();

        this.setState({ [event.target.name]: event.target.value });

    }
    /**  handle add new button, pass it to backend :
     * @params this.state :coming from user's input, needs {name, date, realAmount}.
     * then, reloads table to reflect backend's changes on transaction. 
    */
    handleAddNew = (event) => {
        event.preventDefault();
       var self = this;
        
       
          axios.post('/transactions', {
            name : this.state.name,
        realAmount: this.state.amount,
        date : this.state.date
          })
          .then(function (response) {
            console.log(response.data);
            self.handleLoad();
          })
          .catch(function (err) {
            self.setState({error : err });
          });
          
        }
    /** mandatory render: 
     * renders table to reflect backend's storage + renders field for user's  input
     * @params this.state : user enters input, stored into the state of the object. 
     */
    render(){
        const {transactions} = this.state;
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
              <label > Transaction: </label><input type="text" name="name" value = {this.state.name} onChange={this.handleChange}  />
                  <label > Amount:</label><input type="text" name="amount" value = {this.state.amount} onChange={this.handleChange}  />
                  <label> Date of Transaction:</label><input type="text" name="date" value = {this.state.date} onChange={this.handleChange}   />
                  
                  <input type="submit" value="add new" onClick={this.handleAddNew}/> 
                  
              </form>
            </div>
 
              
            </div>
            </div>
            
        )
    }
}