import React, { Component } from "react";

export default class TransItem extends Component {
  //renders each cell for transaction table.

  render() {
    const trans = this.props.trans;

    return (
      <tr>
        <td width={120}>{trans.name}</td>
        <td width={200}>{trans.amount}</td>
        <td width={200}>{trans.date}</td>
      </tr>
    );
  }
}
