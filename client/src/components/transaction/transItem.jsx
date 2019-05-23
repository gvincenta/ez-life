import React, { Component } from "react";

export default class TransItem extends Component {
    //renders each cell for transaction table.
    formatDate = date => {
        var d = new Date(date).toDateString();
        return d;
    };

    render() {
        const trans = this.props.trans;
        var date = this.formatDate(this.props.trans.date);
        return (
            <tr>
                <td width={120}>{trans.name}</td>
                <td width={120}>{trans.amount}</td>
                <td width={120}>{date}</td>
                <td width={50}>
                    <button
                        type="button"
                        name="update"
                        class="btn btn-secondary"
                        onClick={this.handleDisplay}
                    >
                        update
                    </button>
                </td>
            </tr>
        );
    }
}
