import React, { Component } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import NavBar from "../navbar/Header";
import "./SignIn.css";
import UserProfile from "../UserProfile";
import browserstore from "browser-session-store";

export default class SignIn extends Component {
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

    // validateForm() {
    //   return this.state.email.length > 0 && this.state.password.length > 0;
    // }

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
    /** login a user */
    handleLogIn = event => {
        this.setState({ error: {} });
        var self = this;
        var path;
        //for existing user, signin:
        if (self.state.existingUser === true) {
            path = "/users/signin";
        }
        //for new user, signup:
        else {
            path = "/users/signup";
        }
        //ask from backend:

        axios
            .post(path, {
                email: self.state.username,
                password: self.state.password
            })
            .then(response => {
                //set token:
                self.setState({ token: response.data.token });
                //setup axios:
                UserProfile.setName(response.data.token);
                axios.defaults.headers.common["Authorization"] =
                    response.data.token;

                //reload page after logging in:
                window.location.reload();
                //catch any errors:
            })
            .catch(err => {
                alert(
                    "password/username incorrect OR may already have signed up."
                );
            });
    };

    // existing user or not:
    isExistingUser = event => {
        var negate = !this.state.existingUser;
        this.setState({ existingUser: negate });
    };

    render() {
        return (
            <div>
                <div id="SignInBox">
                    <div className="SignInTitle">Sign In</div>
                    <div className="SignIn">
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup controlId="email" bsSize="lg">
                                <FormControl
                                    autoFocus
                                    type="text"
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.handleChange}
                                    placeholder="Username or Email"
                                />
                            </FormGroup>
                            <FormGroup controlId="password" bsSize="large">
                                <FormControl
                                    type="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    placeholder="Password"
                                />
                            </FormGroup>
                            <Button
                                name="login"
                                type="button"
                                class="btn btn-secondary"
                                onClick={this.handleLogIn}
                            >
                                Sign In
                            </Button>
                            <br />
                        </form>
                        <div className="checkbox">
                            <input
                                type="checkbox"
                                value="I am an existing user"
                                onClick={this.isExistingUser}
                            />
                            <label> I am an existing user </label> <br />
                            <br />
                        </div>
                    </div>
                    <div className="NoAccount">
                        Don't have an account?
                        <br />
                        Create an account
                    </div>
                </div>
            </div>
        );
    }
}
