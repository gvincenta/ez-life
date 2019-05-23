import React, { Component } from "react";
import "./navbar.css";
import introJs from "intro.js";
import "intro.js/introjs.css";

class NavBar extends Component {
    startIntro = () => {
        window.location.href = "budget?multipage=true";
    };

    render() {
        return (
            <div class="header">
                <div class="header-right">
                    {this.props.signedIn === true ? (
                        <a className="active" onClick={this.props.logout}>
                            Log Out
                        </a>
                    ) : (
                        <div> </div>
                    )}
                    <a href="#default" class="logo">
                        Ez Life
                    </a>
                </div>

                <div className="header-right">
                    <button
                        className="btn btn-secondary"
                        onClick={this.startIntro}
                    >
                        Guide
                    </button>
                </div>
            </div>
        );
    }
}
export default NavBar;
