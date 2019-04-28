import React, {Component} from 'react';
import PubSub from 'pubsub-js';

import GoalItem from './goalItem';
import axios from 'axios';
//handles user's goals

export default class GoalList extends Component{
    constructor (props) {
    super(props);   
    this.state = {
        name : "",
        amount : "",
        preference :"",
        due : "",
        progress : "",
        goals: [
            {
                name:"empty" ,
                due: "YYYY-MM-DD",
                preference: 2,
                amount: 0,
                progress: 0
            }
        ],
        display: 'none',
        update: 'none',
        error : {}
       
       
    }
    axios.defaults.baseURL = '/api';
    axios.defaults.headers.common['Authorization'] = this.props.token;
    this.handleLoad();

}  //handles each input field's changes: 
    handleChange = (event) => {
      event.preventDefault();

        this.setState({ [event.target.name]: event.target.value });

    }

    componentDidMount(){
        PubSub.subscribe('displayChange', (msg,display) => {
            this.setState({display})
        })
    }

    
    handleAddClick = () => {
        this.setState({display: 'block'})
    }
    //handles adding a new goal
    handleAddNew = (event) => {
      event.preventDefault();

    
          var self = this;
            axios.post('/goals', {
            name: this.state.name,
            amount: this.state.amount,
            preference: this.state.preference,
            due: this.state.due
          })
          .then(function (response) {
            self.handleLoad();

        })
          .catch(function (err) {
            self.setState({error: err});
          });
    }
    //handles loading all goals: 
    handleLoad = ()=>{
        var self = this; 
        axios.get('/goals')
      .then(function (response) {
        var d = response.data;
        self.setState({goals: d });
      })
      .catch(function (error) {
        alert(error);
      });
    }

    //handles updating a goal: 

    handleUpdate = (event) => {
        event.preventDefault();

        var self = this;
    
        
        axios.put('/goals', { 
          name : this.state.name, 
          progress: this.state.progress
        })
          .then(function (response) {
            self.handleLoad();
          })
          .catch(function (err) {
            alert(err);
            self.setState({error: err});

          });
      }
    //renders goal's input fields + goal's table: 
    render(){
        const {goals} = this.state
        const {display} = this.state
        const {update} = this.state
        return(
            <div>
                 <table className="table table-hover">
                    <thead>
                        <tr>
                        <th>Due Date</th>
                        <th>Goal</th>
                        <th>Total Amount</th>
                        <th>Amount Saved So Far.. </th>
                        <th>Preference </th>

                        </tr>
                    </thead>
                    <tbody>
                        {goals.map((goal,index) => (
                          
                                     
                                    <GoalItem key={index} goals ={goal}/>
                                   
                            ))
                        }
                    </tbody>
                </table>
                <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                  Goal
                </h3>
            </div>
            <div className="panel-body"> 
              <form>
                <label > Name: </label><input type='text' name='name' value={this.state.name} 
                  placeholder="at least 3 characters" onChange={this.handleChange}/>
                <label > Total Amount:</label><input type='number' name='amount' value={this.state.amount} 
                  placeholder="at least > 1" onChange={this.handleChange}/>

                <label> Preference:</label><input type='text' name='preference' value={this.state.preference} 
                  placeholder="1 to 5" onChange={this.handleChange}/>
                <label > Due:</label><input type='date' name='due' value={this.state.due} 
                  placeholder="YYYY-MM-DD" onChange={this.handleChange}/>
                  <label > Add Amount:</label><input type='number' name='progress' value={this.state.progress} 
                  placeholder="at least > 1 for updating" onChange={this.handleChange}/>

                <input type="submit" value="add new" onClick={this.handleAddNew}/> 
                <input type="submit" value="update existing" onClick={this.handleUpdate}/>
              </form>
            </div>
 
            </div>
            </div>
            
        )
    }
}