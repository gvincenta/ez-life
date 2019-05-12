import React, { Component } from "react";

import BudgetItem from "./budgetItem";
//handles making categories and budget planning
export default class BudgetList extends Component {
  constructor(props) {
    super(props); // mandatory
    
    this.state = {
      mode : "read",
      name: "",
      budgetedAmount: 1,
      isIncome: "needs/wants/income",
      preference: 1,
      budgets: [
        {
          name: "min. 3 characters",
          budgetedAmount: "minimum 1",
          isIncome: "needs/wants/income",
          preference: "useful for wants, 1 to 10"
        }
      ],
      error: {},
      response: 0
    };
    this.handleLoad();
  }
  //handle item loading:
  handleLoad = () => {
    var self = this;
    this.props.axios
      .get("/budget")
      .then(function(response) {
        var d = response.data;
        self.setState({ budgets: d });
      })
      .catch(function(err) {
        self.setState({ error: err });
      });
  };
  setUpdate = (budget) => {
    for (var i = 0; i < this.state.budgets.length; i++){

      if (this.state.budgets[i].name === budget){
        this.setState({
          name: this.state.budgets[i].name,
          budgetedAmount: this.state.budgets[i].budgetedAmount,
          isIncome:  this.state.budgets[i].isIncome,
          preference: this.state.budgets[i].preference,
          
        })
        this.setState({mode: "update"});
        break; 
      }
      
    }
  }

  //handle adding more categories,
  handleAddNew = event => {
    event.preventDefault();
    var self = this;

    this.props.axios
      .post("/budget", {
        name: self.state.name,
        isIncome: self.state.isIncome,
        preference: self.state.preference
      })
      .then(function(response) {
        self.handleLoad();
      })
      .catch(function(err) {
        self.setState({ error: err });
      });
  };

  //handles changes to each input field
  handleChange = event => {
    event.preventDefault();

    this.setState({ [event.target.name]: event.target.value });
  };
  //handles budget planning for next month:
  handlePlan = event => {
    event.preventDefault();

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
  //handles updating budget amounts:
  handleUpdate = event => {
    console.log("handling update");
    var self = this;

    console.log(self.state.name, self.state.budgetedAmount, self.state.preference);
    event.preventDefault();


    this.props.axios
      .put("/budget", {
        name: self.state.name,
        budgetedAmount: self.state.budgetedAmount,
        preference: self.state.preference
      })
      .then(function(response) {
        console.log(response);

        self.handleLoad();
      })
      .catch(function(err) {
        self.setState({ error: err });
      });
  };
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
  //handles deleting a  category:
  handleDelete = budget => {
    var self = this;

    this.props.axios
      .delete("/budget", {
        data: { name: budget }
      })
      .then(function(response) {
        self.handleLoad();
      })
      .catch(function(err) {
        self.setState({ error: err });
      });
  };
  // renders category table + category input's fields :
  render = () => {
    const { budgets } = this.state;
    var res;

    if (this.state.mode === "read") {
      res = (
        <div>
          <h1> Budget Categories </h1>
          <table className="table responsive">
            <thead>
              <tr>
                <th width={120}>Name: </th>
                <th width={200}>Type: </th>
                <th width={200}>Preference (1 to 10): </th>
                <th width={50}> Update </th>
                <th width={50}> Delete </th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget, index) => (
                <BudgetItem key={index} budget={budget}  setUpdate = {this.setUpdate} handleDelete ={this.handleDelete}/>
              ))}
            </tbody>
          </table>
          <button name = "add" type="button" class="btn btn-secondary" onClick = {this.handleDisplay}>
            Add New Goals
          </button>
          <button name = "plan" type="button" class="btn btn-secondary" onClick = {this.handleDisplay}>
            plan for next month
          </button>
          
          <label class="switch">
    <input type="checkbox" />
  <span class="slider round"></span>
            </label>
        </div>
      );
    } 
    else if (this.state.mode === "add"){
      
      res = (<div>
          <table className="table responsive">
            <thead>
              <tr>
                <th width={120}>Name: </th>
                <th width={200}>Type: </th>
                <th width={200}>Preference (1 to 10): </th>
                <th width={200}>Budget Amount: </th>
                <th width={50}> Update </th>
                <th width={50}> Delete </th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget, index) => (
                <BudgetItem key={index} budget={budget}  setUpdate = {this.setUpdate} handleDelete ={this.handleDelete}/>
              ))}
            </tbody>
          </table>
          <form>
                <label> Name: </label>
                <input
                  type="text"
                  name="name"
                  placeholder = "min. 3 characters"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
                <label> Type:</label>
                <input
                  type="text"
                  name="isIncome"
                  placeholder = "income/needs/wants"
                  value={this.state.isIncome}
                  onChange={this.handleChange}
                />
                {(this.state.isIncome === "wants") ?
                (<div><label> Preference:</label>
                <input
                  type="text"
                  name="preference"
                  placeholder = "1 to 10"
                  value={this.state.preference}
                  onChange={this.handleChange}
                /></div>):<div></div>
                }

          </form>
          <button name = "submit_add" type="button" class="btn btn-secondary" onClick = {this.handleDisplay}>
            Submit
          </button>
          <button name = "cancel" type="button" class="btn btn-secondary" onClick = {this.handleDisplay}>
            Cancel
          </button>
        </div>);
    }
    else if (this.state.mode === "update" && this.state.isIncome === "wants"){
      res = (<div>
          <table className="table responsive">
            <thead>
              <tr>
                <th width={120}>Name: </th>
                <th width={200}>Type: </th>
                <th width={200}>Preference (1 to 10): </th>
                <th width={200}>Budget Amount: </th>
                <th width={50}> Update </th>
                <th width={50}> Delete </th>

              </tr>
            </thead>
            <tbody>
              {budgets.map((budget, index) => (
                <BudgetItem key={index} budget={budget}  setUpdate = {this.setUpdate} handleDelete ={this.handleDelete}/>
              ))}
            </tbody>
          </table>
          <form>
                <h2> Updating {this.state.name} </h2>
                <h2> {this.state.isIncome} </h2>

                <label> Preference:</label>
                <input
                  type="text"
                  name="preference"
                  value={this.state.preference}
                  onChange={this.handleChange}
                />
                <label> Budget Amount:</label>
                <input
                  type="text"
                  name="budgetedAmount"
                  value={this.state.budgetedAmount}
                  onChange={this.handleChange}
                />
               


          </form>
          <button name = "submit_update" type="button" class="btn btn-secondary" onClick = {this.handleDisplay}>
            Submit
          </button>
          <button name = "cancel" type="button" class="btn btn-secondary" onClick = {this.handleDisplay}>
            Cancel
          </button>
        </div>);
    }
    else {
      var plans = JSON.stringify(this.state.response);
      res = (
        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name: </th>
                <th>Type: </th>
                <th>Preference (1 to 10): </th>
                <th>Suggested Amount: </th>
                <th width={50}> Confirm / Change </th>

              </tr>
            </thead>
            <tbody>
              {this.state.response.map((res, index) => (
                <BudgetItem key={index} result={res} />
              ))}
            </tbody>
          </table>
          <button name = "add" type="button" class="btn btn-secondary" onClick = {this.handleDisplay}>
            Add New Goals
          </button>
        </div>
      );
    }
    return res;
  };
}
