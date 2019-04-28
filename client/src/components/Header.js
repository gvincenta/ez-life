import React, { Component } from 'react';
import {Switch, Route, NavLink } from 'react-router-dom';



export default class Header extends Component {
  
    
  render() {
     
    return (
     
      <div  className="Header">
      <p align="center">
      <h4 className="Header">EZY LIFE</h4>
      <span className="Header">We save your money, so you don't have to. </span>
      <table width = "400"> 
        <td > HomePage </td>

        
        <td > Sign In </td>
 

        <td > Sign Out </td>

        </table> 
      </p>
    </div>
    
    );
  }
}




