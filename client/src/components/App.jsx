import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import NavBar from "./Header";
import Report from "./Report";
import SideBar from "./sidebar";
import TransList from "./transaction/transList";
import GoalList from "./goal/goalList";
import BudgetList from "./budget/budgetList.jsx";
import UserProfile from './UserProfile';
import browserstore from "browser-session-store"

class App extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      token :"",
      axios: "",
      username: "",
      password: "",
      existingUser: false,
      error: ""
    };
    this.setToken()
    
  }
   setToken(){
     var self = this;
    //console.log(UserProfile.getName(), "First init");
    browserstore.get("ezLife", function (err,val){
      console.log(err);
      // handle error or nonexistence token:
      if(err || (val == null)){
        self.setState({token : ""});
        return;
      }
      // init axios,token to this existing token: 

      axios.defaults.headers.common["Authorization"] = val; 
      self.setState({token : val});
      return;
      
    })
    
    
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
      .post(path, { email: self.state.username, password: self.state.password })
      .then(response => {
        //set token:
        self.setState({ token: response.data.token });
        //setup axios: 
        UserProfile.setName(response.data.token);
        axios.defaults.headers.common["Authorization"] = response.data.token; 

        //reload page after logging in:
        window.location.reload();
        //catch any errors:
      })
      .catch(err => {
        alert("password/username incorrect OR may already have signed up.");
      });
  };
  //user log out: 
  handleLogOut = event =>{
    //remove persisting token: 
    browserstore.remove("ezLife");
    //reset state, reload page: 
    this.setToken();
    window.location.reload();
  }

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
        <div >
          <NavBar signedIn = {false}/>
          <form>
            <input
              type="checkbox"
              value="I am an existing user"
              onClick={this.isExistingUser}
            />< label> I am an existing user </label> <br /><br />
            <h2>Sign Up / Log In </h2>
            
            <div class="input-container">
                <i class="fa fa-envelope icon"></i>

    <label> email/username: </label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
            placeholder="not case sensitive"
          />
          </div>

  <div class="input-container">
    <i class="fa fa-key icon"></i>
          <label> password: </label>

          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="case sensitive"
          />

  </div>

  <button name = "login" type="button" class="btn btn-secondary" onClick = {this.handleLogIn}> Log In </button>
  
          </form></div>

          

          

          

      );
    } else {
      res = (
        <div>
          <NavBar signedIn = {true} logout= {this.handleLogOut}/>

          <SideBar/>
          <div class = "panel-body">

          <div class = "row">
          <div className="col-xs-2"></div>
          <div className="col-xs-9">
                <Switch>
                  <Route
                    exact
                    path="/transaction"
                    render={() => <TransList axios={axios} />}
                  />
                  <Route
                    path="/goal"
                    render={() => <GoalList axios={axios} />}
                  />
                  <Route
                    path="/report"
                    render={() => <Report axios = {axios} />}
                  />
                  <Route
                    path="/budget"
                    render={() => <BudgetList axios={axios} />}
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
