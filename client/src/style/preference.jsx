import React, { Component } from "react";

export default class Prefence extends Component {
    render() {
        const pref = [];
        for (let j = 1; j < 11; j++) {
            pref.push(j);
        }

        return (
            <select className="form-control" name="prefence">
                {pref.map((pre, index) => {
                    return (
                        <option key={index} value={pre}>
                            {pre}
                        </option>
                    );
                })}
            </select>
        );
    }
}
