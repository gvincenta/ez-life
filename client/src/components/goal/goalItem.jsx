import React, { Component } from "react";

export default class GoalItem extends Component {

    //format date:
   formatDate = (date) => {
    var d = new Date(date).toDateString();
    return d;
   }
  //ready for update 1 row:    
   handleDisplay = event => {
      this.props.setUpdate(this.props.goals.name);
  }
  
  

  
  render() {

    var goal = this.props.goals;
    var date = this.formatDate(goal.due);
    var res = (<tr>
            <td width={120}> {date} </td>
            <td width={200}>{goal.name} </td>
            <td width={200}> {goal.amount} </td>
            <td width={200}> {goal.progress}</td>
            <td width={120}> {goal.preference}</td>
            <td width={50}>
            <button type="button" name = "update" class="btn btn-secondary"onClick = {this.handleDisplay}>
              update
              </button></td>
          </tr>);
    
    //renders each cell for goal's table:

    return res; 
  }
}
