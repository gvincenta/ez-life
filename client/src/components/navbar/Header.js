import React, { Component } from "react";
import "./navbar.css";
import "intro.js/introjs.css";

import {Button} from "react-bootstrap";
class NavBar extends Component {
    startIntro = () => {
        window.location.href = "budget?multipage=true";
    };

    render() {
        return (
            <div class="header">
                <div class="header-right">
                    {this.props.signedIn === true ? (
                        <a  ><Button onClick={this.props.logout}>
                            Log Out
                        </Button></a>
                    ) : (
                        <div> </div>
                    )}
                    <a href="#default" class="logo">
                        Ez Life
                    </a>
                </div>

                <div className="header-right">
                <a ><Button
                        className="btn btn-secondary"
                        onClick={this.startIntro}
                    >
                        Guide
                    </Button></a>
                </div>
            </div>
        );
    }
}
export default NavBar;
