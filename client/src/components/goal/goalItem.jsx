import React, { Component } from "react";

export default class GoalItem extends Component {

  constructor(props){
      super(props);
      this.state = {
          mode: "read"
      }

  }
   formatDate = (date) => {
    var d = new Date(date).toDateString();
    return d;
   }
       
   handleDisplay = event => {
      console.log(this.props.goals.name, "setUpdate from child");
      this.props.setUpdate(this.props.goals.name);
  }
  
  

  handleChange = event => {
    this.setState({[event.target.name] : event.target.value});
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
