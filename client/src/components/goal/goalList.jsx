import React, { Component } from "react";
import PubSub from "pubsub-js";

import GoalItem from "./goalItem";
import axios from "axios";
import CardGroup from "react-bootstrap/CardGroup";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

//handles user's goals

export default class GoalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "at least 3 characters",
      amount: "at least > 1",
      preference: "1 to 5 ",
      due: "YYYY-MM-DD",
      progress: "at least > 1 for updating",
      goals: [
        {
          name: "empty",
          due: "YYYY-MM-DD",
          preference: 2,
          amount: 0,
          progress: 0
        }
      ],
      display: "none",
      update: "none",
      error: {}
    };
    axios.defaults.baseURL = "/api";
    axios.defaults.headers.common["Authorization"] = this.props.token;
    this.handleLoad();
  } //handles each input field's changes:
  handleChange = event => {
    event.preventDefault();

    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    PubSub.subscribe("displayChange", (msg, display) => {
      this.setState({ display });
    });
  }

  handleAddClick = () => {
    this.setState({ display: "block" });
  };
  //handles adding a new goal
  handleAddNew = event => {
    event.preventDefault();

    var self = this;
    axios
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
    axios
      .get("/goals")
      .then(function(response) {
        var d = response.data;
        self.setState({ goals: d });
      })
      .catch(function(error) {
        alert(error);
      });
  };

  //handles updating a goal:

  handleUpdate = event => {
    event.preventDefault();

    var self = this;

    axios
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
    const { display } = this.state;
    const { update } = this.state;
    return (
      <div>
        <div className="table responsive">
          <table class="table">
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
              {goals.map((goal, index) => (
                <GoalItem key={index} goals={goal} />
              ))}
            </tbody>
          </table>
        </div>

        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-secondary">
            Left
          </button>
          <button type="button" class="btn btn-secondary">
            Middle
          </button>
          <button type="button" class="btn btn-secondary">
            Right
          </button>
        </div>
        <form>
          <label> Name: </label>
          <input
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <label> Total Amount:</label>
          <input
            type="number"
            name="amount"
            value={this.state.amount}
            onChange={this.handleChange}
          />

          <label> Preference:</label>
          <input
            type="text"
            name="preference"
            value={this.state.preference}
            onChange={this.handleChange}
          />
          <label> Due:</label>
          <input
            type="date"
            name="due"
            value={this.state.due}
            onChange={this.handleChange}
          />
          <label> Add Amount:</label>
          <input
            type="number"
            name="progress"
            value={this.state.progress}
            onChange={this.handleChange}
          />

          <input type="submit" value="add new" onClick={this.handleAddNew} />
          <input
            type="submit"
            value="update existing"
            onClick={this.handleUpdate}
          />
        </form>
      </div>
    );
  }
}
