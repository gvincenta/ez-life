import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./navbar.css"

class NavBar extends Component {
  render() {
    return (
        <div class="header">
        <div class="header-right">
        <a href="#default" class="logo">Ez Life</a>
          <a class="active">Sign In</a>
          <a class="active">Sign Out</a>
        </div>
      </div>
    )
  }
}
export default NavBar;