import React, {Component} from 'react';

export default class BudgetItem extends Component{
    
    //renders each cell for the budget category table.

    render(){
        const budgets = this.props.budget;

        return(
            <tr>
            <td width={120} >{budgets.name}</td>
            <td width={200}>{budgets.isIncome}</td>
            <td width={200}>{budgets.preference}</td>
            <td width={200}>{budgets.budgetedAmount}</td>           
            </tr>
)
    }
}