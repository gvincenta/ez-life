import React, { Component } from "react";

import TransItem from "./transItem";
/**TransList, a class to render all transaction's lists.  */
export default class TransList extends Component {
  /** init object
   * @params this.props: needs user's token for axios to make requests to backend.
   */
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      date: "YYYY-MM-DD",
      amount: "at least 1",
      transactions: [
        {
          name: "empty",
          due: "YYYY-MM-DD",
          amount: 0,
          _id: "s"
        }
      ],
      error: {}
    };
    this.handleLoad();
  }
  handleLoad = () => {
    var self = this;
    this.props.axios
      .get("/transactions")
      .then(function(response) {
        var d = response.data;

        self.setState({ transactions: d });
      })
      .catch(function(err) {
        alert(err);
        self.setState({ error: err });
      });
  };

  /** handle 1 field's change: */
  handleChange = event => {
    event.preventDefault();

    this.setState({ [event.target.name]: event.target.value });
  };
  /**  handle add new button, pass it to backend :
   * @params this.state :coming from user's input, needs {name, date, realAmount}.
   * then, reloads table to reflect backend's changes on transaction.
   */
  handleAddNew = event => {
    event.preventDefault();
    var self = this;
    console.log("frontend", this.state);
    this.props.axios
      .post("/transactions", {
        name: this.state.name,
        realAmount: this.state.amount,
        date: this.state.date
      })
      .then(function(response) {
        self.handleLoad();
      })
      .catch(function(err) {
        alert(err);
        self.setState({ error: err });
      });
  };
  /** mandatory render:
   * renders table to reflect backend's storage + renders field for user's  input
   * @params this.state : user enters input, stored into the state of the object.
   */
  render() {
    const { transactions } = this.state;
    return (
      <div>
        <h1> Transaction Logs </h1>

        <table className="table responsive">
          <thead>
            <tr>
              <th width={120}>Name</th>
              <th width={120}>Amount</th>
              <th width={120}>Date</th>
              <th width={50}> Update/Delete</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tran, index) => (
              <TransItem key={index} trans={tran} />
            ))}
          </tbody>
        </table>
        <div className="panel panel-default">
          
          <div className="panel-body">
            <form className="form-horizontal">
              <label> Transaction: </label>
              <input
                type="text"
                name="name"
                value={this.state.name}
                placeholder="min. 3 characters"
                onChange={this.handleChange}
              />
              <label> Amount:</label>
              <input
                type="number"
                name="amount"
                value={this.state.amount}
                onChange={this.handleChange}
              />
              <label> Date of Transaction:</label>
              <input
                type="date"
                name="date"
                value={this.state.date}
                onChange={this.handleChange}
              />

              <input
                type="submit"
                value="add new"
                onClick={this.handleAddNew}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
