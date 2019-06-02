import React, { Component } from "react";
import { Link } from "react-router-dom";
import SignIn from "../signin/SignIn";
import "./Homepage.css";

export default class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signin: false
        };
    }
    /**sets token */
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    handleSignIn = event => {
        this.setState({ signin: true });
    };

    render() {
        var res;
        if (this.state.signin === false) {
            res = (
                <div id="homepage">
                    <strong>
                        <h1 id="centertitle">Welcome to Ezy-life.</h1>
                    </strong>
                    <h2 id="centertitle">
                        We save your money, so you don't have to.
                    </h2>
                    <Link id="signin" onClick={this.handleSignIn}>
                        Click here to Sign In!
                    </Link>
                </div>
            );
        } else {
            res = <SignIn />;
        }
        return res;
    }
}
