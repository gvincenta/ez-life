import React, { Component } from "react";

export default class GoalItem extends Component {
  handleEnter = event => {
    if (event.key === "Enter") {
    }
  };
  render() {
    const goal = this.props.goals;

    //renders each cell for goal's table:
    return (
      <tr>
        <td width={120}> {goal.due} </td>
        <td width={200}>{goal.name} </td>
        <td width={200}> {goal.amount} </td>
        <td width={200}> {goal.progress}</td>
        <td width={200}> {goal.preference}</td>
      </tr>
    );
  }
}
