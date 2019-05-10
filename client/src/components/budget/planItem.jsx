import React, { Component } from "react";

export default class PlanItem extends Component {
  //displays read only cells for budget plannings table:

  render() {
    return (
      <tr>
        <td width={120}> {this.props.result.name} </td>
        <td width={200}> {this.props.result.isIncome} </td>
        <td width={200}> {this.props.result.preference}</td>
        <td width={200}>{this.props.result.suggestedAmount}</td>
      </tr>
    );
  }
}
