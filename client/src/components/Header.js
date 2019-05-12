import React, { Component } from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import NavBar from './NavBar';
export default class Header extends Component {
  render() {
    return (
      <NavBar/>
    );
  }
}
