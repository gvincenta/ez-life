import React, { Component } from 'react';
import {Switch, Route, NavLink } from 'react-router-dom';

import Goals from "./Goals";
import Transaction from "./Transaction";
import Report from "./Report";
import Budget from "./Budget";

class App extends Component {
    render() {
      return (
        <div>
          <div className = "row">
              <div className = "col-xs-offset-2 col-xs-8">
                  <div className = "page-header">
                      <h2>Dashboard</h2>
                  </div>              
              </div>
          </div>
          
          <div className = "row">
            <div className="span4">
            <div className = "col-xs-2 col-xs-offset-2">
                <div className = "list-group">
                    <NavLink className = "list-group-item" to="/goal">Goal</NavLink>
                    <NavLink className = "list-group-item" to="/transaction">Transaction</NavLink>
                    <NavLink className = "list-group-item" to="/report">Report</NavLink>
                    <NavLink className = "list-group-item" to="/budget">Budgeting</NavLink>
                </div>              
            </div>
            </div>
            <div className = "col-xs-6">
              <div className = "panel">
                  <div className = "panel-body">
                    <Switch>
                      <Route exact path='/transaction'render={() => (<Transaction token = {this.props.token}/>)}/>
                      <Route path='/goal'  render={() => (<Goals token = {this.props.token}/>)} />
                      <Route path='/report'  render={() => (<Report token = {this.props.token}/>)}/>
                      <Route path='/budget'  render={() => (<Budget token = {this.props.token}/>)}/>
                    
                    </Switch>
                  </div>              
              </div>
            </div>
          </div>
        </div>
      
      );
    }
  }
  
  export default App;