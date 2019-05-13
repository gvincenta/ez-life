import React, { Component } from 'react';
import "./navbar.css"

class NavBar extends Component {
  render() {
    return (
        <div class="header">
        <div class="header-right">
        {this.props.signedIn === true ? <a class="active" onClick={this.props.logout}>Log Out</a>: <div> </div>}
        <a href="#default" class="logo">Ez Life</a>
        </div>
      </div>
    )
  }
}
export default NavBar;