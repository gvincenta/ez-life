import React, { Component } from "react";
import PubSub from "pubsub-js";
import introJs from "intro.js";
import "intro.js/introjs.css";
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
            mode: "read",
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
        if (RegExp("multipage=3", "gi").test(window.location.search)) {
            introJs()
                .setOption("doneLabel", "Next page")
                .start()
                .oncomplete(function() {
                    window.location.href = "report?multipage=4";
                });
        }
    }
    //ready for updating 1 item:
    setUpdate = goal => {
        for (var i = 0; i < this.state.goals.length; i++) {
            if (this.state.goals[i].name === goal) {
                this.setState({
                    name: this.state.goals[i].name,
                    amount: this.state.goals[i].amount,
                    preference: this.state.goals[i].preference,
                    due: this.state.goals[i].due,
                    progress: this.state.goals[i].progress
                });
                this.setState({ mode: "update" });
                break;
            }
        }
    };
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
    handleDisplay = event => {
        if (event.target.name === "cancel") {
            this.setState({ mode: "read" });
            return;
        } else if (event.target.name === "submit_update") {
            this.setState({ mode: "read" });
            this.handleUpdate(event);
            return;
        } else if (event.target.name === "submit_add") {
            this.setState({ mode: "read" });
            this.handleAddNew(event);

            return;
        } else if (event.target.name === "add") {
            this.setState({ mode: "add" ,
            name: "",
            amount: 1,
            preference: 1,
            due: "",
            progress:0});
            return;
        }
    };
    //handles updating a goal:

    handleUpdate = event => {
        event.preventDefault();

        var self = this;

        this.props.axios
            .put("/goals", {
                name: this.state.name,
                amount : this.state.amount,
                preference: this.state.preference,
                progress: this.state.progress,
                due : this.state.due

            })
            .then(function(response) {
                self.handleLoad();
            })
            .catch(function(err) {
                alert(err);
                self.setState({ error: err });
            });
    };
    
    //handles deleting a  goal:
    handleDelete = (goal) => {
        var self_2 = this; 
    
        this.props.axios
          .delete("/goals", {
            data: { name: goal }
          })
          .then(function(response) {
            self_2.handleLoad();
          })
          .catch(function(err) {
            self_2.setState({ error: err });
          });
      };

    //renders goal's input fields + goal's table:
    render() {
        const { goals,mode } = this.state;
        var res;
        return (
            <div className="table responsive">
            
                    <h1 data-step="1" data-intro="Record your Goals here">
                        {" "}
                        Goals{" "}
                    </h1>
                    <hr/>
                    {(() => {
                     switch(mode) {
                        case 'add':
                            return (
                                <div ><h3> add new goals: </h3>
                            
                           
                            
                            <div class="col-xs-3">
                                <label for="ex1" > Name: </label>
                                
                                <input className="form-control" id="ex1" 
                                    type="text"
                                    name="name"
                                    placeholder="min. 3 characters"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                />
                                </div>
                                <div class="col-xs-2">
                                <label for="ex2"> Total Amount:</label>
                                <input className="form-control" id="ex2" 
                                    type="number"
                                    name="amount"
                                    placeholder="minimum $1"
                                    value={this.state.amount}
                                    onChange={this.handleChange}
                                /></div>
                                <div class="col-xs-2">
                                <label for="ex3">  Preference:</label>
                                <input className="form-control" id="ex3" 
                                    type="number"
                                    name="preference"
                                    placeholder="1 to 5"
                                    value={this.state.preference}
                                    onChange={this.handleChange}
                                /> </div>
                                <div class="col-xs-2">
                                <label for="ex4"> Due:</label>
                                <input className="form-control" id="ex4" 
                                    type="date"
                                    name="due"
                                    value={this.state.due}
                                    placeholder="min. tomorrow"
                                    onChange={this.handleChange}
                                /> </div>
                                <br/> 
                                <button
                                    name="submit_add"
                                    type="button"
                                    class="btn btn-secondary"
                                    onClick={this.handleDisplay}
                                >
                                    Submit
                                </button>
                               &nbsp;
                                <button
                                    name="cancel"
                                    type="button"
                                    class="btn btn-secondary"
                                    onClick={this.handleDisplay}
                                >
                                    Cancel
                                </button>
                           </div>);
                        case 'read':
                            return (<button
                                name="add"
                                type="button"
                                class="btn btn-secondary"
                                data-step="2"
                                data-intro="add new Goal"
                                onClick={this.handleDisplay}
                                >
                                Add New Goals
                            </button>);
                        case 'update':
                            return ( <div ><h3>  Updating {this.state.name} </h3>
                       
                        
                            <div class="col-xs-2">
                                
        
                                <label for="ex5"> Total Amount:</label>
                                <input className="form-control" id="ex5" 
                                    type="number"
                                    name="amount"
                                    placeholder="minimum $1"
                                    value={this.state.amount}
                                    onChange={this.handleChange}
                                /></div>
                                <div class="col-xs-2">
                                
        
                                <label for="ex6"> Preference:</label>
                                <input className="form-control" id="ex6"
                                    type="number"
                                    name="preference"
                                    placeholder="1 to 5"
                                    value={this.state.preference}
                                    onChange={this.handleChange}
                                /></div>
                                <div class="col-xs-3">
                                
        
                                <label for="ex7">  Due:</label>
                                <input className="form-control" id="ex7"
                                    type="date"
                                    name="due"
                                    value={this.state.due}
                                    placeholder="min. tomorrow"
                                    onChange={this.handleChange}
                                /></div>
                                <div class="col-xs-2">
                                
        
                                <label for="ex8">  Add Amount:</label>
                                <input className="form-control" id="ex8"
                                    type="number"
                                    name="progress"
                                    placeholder="min. 1"
                                    value={this.state.progress}
                                    onChange={this.handleChange}
                                /></div>
                                <br/>
                                
                                <button
                                    name="submit_update"
                                    type="button"
                                    class="btn btn-secondary"
                                    onClick={this.handleDisplay}
                                >
                                    Submit
                                </button>
                                &nbsp;
                                <button
                                    name="cancel"
                                    type="button"
                                    class="btn btn-secondary"
                                    onClick={this.handleDisplay}
                                >
                                    Cancel
                                </button>
                            </div> );
                        default:
                            return null;
                        }
                    })()}
                    <hr/>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Due Date</th>
                                <th>Goal</th>
                                <th>Total Amount</th>
                                <th>Amount Saved So Far.. </th>
                                <th>Preference </th>
                                <th> Update </th>
                                <th> Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goals.map((goal, index) => (
                                <GoalItem
                                    key={index}
                                    goals={goal}
                                    setUpdate={this.setUpdate}
                                    handleDelete = {this.handleDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                    
                    
                </div>
        );
    }
}
