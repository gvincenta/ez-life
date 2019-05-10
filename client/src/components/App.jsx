import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Header from "./Header";
import Goals from "./Goals";
import Transaction from "./Transaction";
import Report from "./Report";
import Budget from "./Budget";
import SideBar from "./sidebar";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      username: "",
      password: "",
      existingUser: false,
      error: ""
    };
    axios.defaults.baseURL = "/api";
  }
  /**sets token */
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleLoad() {}
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
      .post(path, { email: self.state.username, password: self.state.password })
      .then(response => {
        //set token:
        self.setState({ token: response.data.token });
        //catch any errors:
      })
      .catch(err => {
        alert("password/username incorrect OR may already have signed up.");
      });
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
      res = (
        <div>
          <Header />

          <input
            type="checkbox"
            value="I am an existing user"
            onClick={this.isExistingUser}
          />

          <label> I am an existing user </label>
          <br />
          <br />

          <label> email/username: </label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
            placeholder="not case sensitive"
          />
          <br />
          <label> password: </label>

          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="case sensitive"
          />

          <input type="submit" value="login" onClick={this.handleLogIn} />
        </div>
      );
    } else {
      res = (
        <div>
          <Header />

          <SideBar token={this.state.token} />
          <div className="row">
            <div className="col-s-offset-2 col-xs-8"> </div>
            <div className="page-header"> </div>
          </div>

          <div className="col-s-6">
            <div className="panel">
              <div className="panel-body">
                <Switch>
                  <Route
                    exact
                    path="/transaction"
                    render={() => <Transaction token={this.state.token} />}
                  />
                  <Route
                    path="/goal"
                    render={() => <Goals token={this.state.token} />}
                  />
                  <Route
                    path="/report"
                    render={() => <Report token={this.state.token} />}
                  />
                  <Route
                    path="/budget"
                    render={() => <Budget token={this.state.token} />}
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

/* Update Layout */

// import React, {Component} from 'react';
// import {Switch, Route, Redirect,NavLink}from 'react-router-dom'
// import { Layout } from "antd";

// import Goal from "./Goals";
// import Transaction from "./Transaction";
// import SideBar from './sidebar';

// import 'antd/dist/antd.css';
// import './App.css';

// const { Header, Footer, Sider, Content } = Layout;

// export default class App extends Component{

//       render() {
//         return (

//           <Layout>

//                 <SideBar/>

//                 <Header style={{ background: '#f4a464', padding: 0}}>
//                 </Header>

//                 <Content style={{
//                     margin: '24px 16px', padding: 24, background: '#fff', height: '85vh'
//                 }}
//                 >
//                     <Switch>
//                         <Route path='/goal' component ={Goal}></Route>
//                         <Route path='/transaction' component ={Transaction}></Route>
//                         <Redirect to ='/transaction'></Redirect>
//                       </Switch>
//                 </Content>

//           </Layout>
//         );
//       }
// }
