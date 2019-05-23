import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import axios from "axios";
import "./App.css";
import NavBar from "./navbar/Header";
import Report from "./report/ReportNew";
import SignIn from "./signin/SignIn";

import SideBar from "./sidebar/sidebar";
import TransList from "./transaction/transList";
import GoalList from "./goal/goalList";
import BudgetList from "./budget/budgetList.jsx";
import UserProfile from "./UserProfile";
import browserstore from "browser-session-store";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: "",
            axios: "",
            username: "",
            password: "",
            existingUser: false,
            error: ""
        };
        this.setToken();
    }
    setToken() {
        var self = this;
        //console.log(UserProfile.getName(), "First init");
        browserstore.get("ezLife", function(err, val) {
            console.log(err);
            // handle error or nonexistence token:
            if (err || val == null) {
                self.setState({ token: "" });
                return;
            }
            // init axios,token to this existing token:

            axios.defaults.headers.common["Authorization"] = val;
            self.setState({ token: val });
            return;
        });
    }
    /**sets token */
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    //user log out:
    handleLogOut = event => {
        //remove persisting token:
        browserstore.remove("ezLife");
        //reset state, reload page:
        this.setToken();
        window.location.reload();
    };

    // existing user or not:
    isExistingUser = event => {
        var negate = !this.state.existingUser;
        this.setState({ existingUser: negate });
    };
    //renders login page, then dashboard page.
    render() {
        var res;
        //first time up, ask for email/username and password:
        if (this.state.token.length === 0) {
            var err = this.state.error;
            res = <SignIn />;
        } else {
            res = (
                <div>
                    <NavBar signedIn={true} logout={this.handleLogOut} />
                    <SideBar />
                    <div class="panel-body">
                        <div class="row">
                            <div className="col-xs-2" />
                            <div className="col-xs-9">
                                <Switch>
                                    <Route
                                        exact
                                        path="/transaction"
                                        render={() => (
                                            <TransList axios={axios} />
                                        )}
                                    />
                                    <Route
                                        path="/goal"
                                        render={() => (
                                            <GoalList axios={axios} />
                                        )}
                                    />
                                    <Route
                                        path="/report"
                                        render={() => <Report axios={axios} />}
                                    />
                                    <Route
                                        path="/budget"
                                        render={() => (
                                            <BudgetList axios={axios} />
                                        )}
                                    />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return res;
    }
}

export default App;
