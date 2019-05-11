import React, { Component } from "react";

export default class BudgetItem extends Component {
  //renders each cell for the budget category table.
  
       
  handleDisplay = event => {
      if (event.target.name === "update"){
        this.props.setUpdate(this.props.budget.name);
      }
      else if(event.target.name === "delete"){
        this.props.handleDelete(this.props.budget.name);

      }
      
  }
  
  
  render() {
    const budgets = this.props.budget;

    return (
      <tr>
        <td width={120}>{budgets.name}</td>
        <td width={200}>{budgets.isIncome}</td>
        {budgets.isIncome === "wants"?
        <td colspan = {3}>
            <td width={300}>{budgets.preference}</td>
            <td width={300}>{budgets.budgetedAmount}</td>
            <td width={50}>
                <button type="button" name = "update" class="btn btn-secondary"onClick = {this.handleDisplay}>
                update
                </button>
            </td>
        </td>
        : <td colspan = {3}></td>
        }
        <td width={50}>
              <button type="button" name = "delete" class="btn btn-secondary"onClick = {this.handleDisplay}>
              delete
              </button>
        </td>
      </tr>
    );
  }
}
