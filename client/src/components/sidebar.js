// sidebar.js

import React from 'react';
import './sidebar.css';
import { slide as Menu } from 'react-burger-menu';
import { Icon } from "react-icons-kit";
import { dashboard } from "react-icons-kit/fa/dashboard";
import {graph} from 'react-icons-kit/iconic/graph'
import {bullseye} from 'react-icons-kit/ikons/bullseye'
import {ic_attach_money} from 'react-icons-kit/md/ic_attach_money'
import {ic_forum} from 'react-icons-kit/md/ic_forum'

import {Switch, Route, NavLink } from 'react-router-dom';

import Goals from "./Goals";
import Transaction from "./Transaction";
import Report from "./Report";
import Budget from "./Budget";


export default props => {
  return (
    <Menu>
      <div>
        <h1>Ez-Life</h1>
      </div>
      <div>
        <h4>Welcome, User</h4>
      </div>
      <a className="menu-item" href="/">
        <Icon id="icon" icon={dashboard} />
        Dashboard
      </a>

      <a className="menu-item" href="/budget">
        <Icon id="icon" icon={ic_attach_money} />
        Budget Plan
      </a>

      <a className="menu-item" href="/goal">
        <Icon id="icon" icon={bullseye} />
        Goals
      </a>

      <a className="menu-item" href="/report">
        <Icon id="icon" icon={graph} />
        Reports
      </a>
      <a className="menu-item" href="/transaction">
        <Icon id="icon" icon={graph} />
        Transaction
      </a>

      <a className="menu-item" href="/">
        <Icon id="icon" icon={ic_forum} />
        Forum
      </a>

    </Menu>
  );
};