import React, { Component } from "react";
import PubSub from "pubsub-js";
import introJs from 'intro.js'
import 'intro.js/introjs.css';
import GoalItem from "./goalItem";

import "./goal.css";
//handles user's goals

export default class GoalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      amount: "",
      preference: "",
      due: "",
      progress: "",
      mode : "read",
      goals: [
        {
          name: "empty",
          due: "YYYY-MM-DD",
          preference: 2,
          amount: 0,
          progress: 0
        }
      ],
      mode: "read",
      error: {}
    };
    this.handleLoad();
  } //handles each input field's changes:

  //change attribute based on inputs: 
  handleChange = event => {
    event.preventDefault();

    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    PubSub.subscribe("displayChange", (msg, display) => {
      this.setState({ display });
    });
    if (RegExp('multipage=3', 'gi').test(window.location.search)){
      introJs().setOption('doneLabel', 'Next page')
      .start().oncomplete(function() {
        window.location.href = 'report?multipage=4';
      });
    }
  }
  //ready for updating 1 item: 
  setUpdate = (goal) => {
    for (var i = 0; i < this.state.goals.length; i++){

      if (this.state.goals[i].name === goal){
        this.setState({
          name: this.state.goals[i].name,
          amount : this.state.goals[i].amount,
          preference : this.state.goals[i].preference,
          due : this.state.goals[i].due,
          progress: this.state.goals[i].progress
        })
        this.setState({mode: "update"});
        break; 
      }
      
    }
  }
  handleAddClick = () => {
    this.setState({ display: "block" });
  };
  //handles adding a new goal
  handleAddNew = event => {
    event.preventDefault();

    var self = this;
    this.props.axios
      .post("/goals", {
        name: this.state.name,
        amount: this.state.amount,
        preference: this.state.preference,
        due: this.state.due
      })
      .then(function(response) {
        self.handleLoad();
      })
      .catch(function(err) {
        self.setState({ error: err });
      });
  };
  //handles loading all goals:
  handleLoad = () => {
    var self = this;
    this.props.axios
      .get("/goals")
      .then(function(response) {
        var d = response.data;
        self.setState({ goals: d });
      })
      .catch(function(error) {
        alert(error);
      });
  };
  //state management
  handleDisplay= event=>{

    if (event.target.name === "cancel"){
      this.setState({mode: "read"});
      return;
    }
    else if(event.target.name === "submit_update"){
      this.setState({mode: "read"});
      this.handleUpdate(event);
      return;

    }
    else if (event.target.name === "submit_add"){
      this.setState({mode: "read"});
      this.handleAddNew(event);

      return;

    }
    else if (event.target.name === "add"){
      this.setState({mode: "add"});
      return;

    }
    
    

  }
  //handles updating a goal:

  handleUpdate = event => {

    event.preventDefault();

    var self = this;

    this.props.axios
      .put("/goals", {
        name: this.state.name,

        progress: this.state.progress
      })
      .then(function(response) {
        self.handleLoad();
      })
      .catch(function(err) {
        alert(err);
        self.setState({ error: err });
      });
  };
 


  //renders goal's input fields + goal's table:
  render() {

    const { goals } = this.state;
    var res;
  
    // just view
    if (this.state.mode === "read"){
      res = (
        <div className="table responsive">
         
          <h1 data-step='1' data-intro='Record your Transaction!' > Goals </h1>
          <table class="table">
            <thead>
              <tr>
                <th>Due Date</th>
                <th>Goal</th>
                <th>Total Amount</th>
                <th>Amount Saved So Far.. </th>
                <th>Preference </th>
                <th> Update /Delete</th> 
              </tr>
            </thead>
            <tbody>
              {goals.map((goal, index) => (
                <GoalItem key={index} goals={goal} setUpdate = {this.setUpdate} />
              ))}
            </tbody>
          </table>
          <button name = "add" type="button" class="btn btn-secondary" data-step='2' data-intro ="add new Goal" onClick = {this.handleDisplay}>
            Add New Goals
          </button>
        </div>);
    }
    //add new
    else if (this.state.mode === "add"){
      res = (
        <div>
        <h1 > Goals </h1>
        <div className="table responsive">
          <table class="table">
            <thead>
              <tr>
                <th width = {120}>Due Date</th>
                <th width = {200}>Goal</th>
                <th width = {200}>Total Amount</th>
                <th width = {200}>Amount Saved So Far.. </th>
                <th width = {120}>Preference </th>
                <th width = {50}> Update /Delete</th> 

              </tr>
            </thead>
            <tbody>
              {goals.map((goal, index) => (
                <GoalItem key={index} goals={goal} setUpdate = {this.setUpdate} />
              ))}
            </tbody>
          </table>
        </div>
        <form>
          <label> Name </label>
          <input
            type="text"
            name="name"
            placeholder = "min. 3 characters"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <label> Total Amount:</label>
          <input
            type="number"
            name="amount"
            placeholder = "minimum $1"
            value={this.state.amount}
            onChange={this.handleChange}
          />

          <label> Preference:</label>
          <input
            type="text"
            name="preference"
            placeholder = "1 to 5"
            value={this.state.preference}
            onChange={this.handleChange}
          />
          <label> Due:</label>
          <input
            type="date"
            name="due"
            value={this.state.due}
            placeholder = "min. tomorrow"
            onChange={this.handleChange}
          />
          <button name = "submit_add" type="button" class="btn btn-secondary" onClick = {this.handleDisplay}>
            Submit
          </button>
          <button name = "cancel" type="button" class="btn btn-secondary" onClick = {this.handleDisplay}>
            Cancel
          </button>

        </form>
          

        </div>);
    }
    //update
    else{
      res = (
        <div>
        <h1> Goals </h1>
        <div className="table responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Due Date</th>
                <th>Goal</th>
                <th>Total Amount</th>
                <th>Amount Saved So Far.. </th>
                <th>Preference </th>
                <th> Update /Delete</th> 

              </tr>
            </thead>
            <tbody>
              {goals.map((goal, index) => (
                <GoalItem key={index} goals={goal} setUpdate = {this.setUpdate} />
              ))}
            </tbody>
          </table>
        </div>
          <form>
          <h2> Updating {this.state.name} </h2>

          <label> Total Amount:</label>
          <input
            type="number"
            name="amount"
            placeholder = "minimum $1"
            value={this.state.amount}
            onChange={this.handleChange}
          />

          <label> Preference:</label>
          <input
            type="text"
            name="preference"
            placeholder = "1 to 5"
            value={this.state.preference}
            onChange={this.handleChange}
          />
          <label> Due:</label>
          <input
            type="date"
            name="due"
            value={this.state.due}
            placeholder = "min. tomorrow"
            onChange={this.handleChange}
          />
          <label> Add Amount:</label>
          <input
            type="number"
            name="progress"
            placeholder = "min. 1"
            value={this.state.progress}
            onChange={this.handleChange}
          />
          <button name = "submit_update" type="button" class="btn btn-secondary" onClick = {this.handleDisplay}>
            Submit
          </button>
          <button name = "cancel" type="button" class="btn btn-secondary" onClick = {this.handleDisplay}>
            Cancel
          </button>
        </form>

          

        </div>);
    }
    
   
    return res;
  }
}
