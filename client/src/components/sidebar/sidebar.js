// sidebar.js

import React from "react";
import "./sidebar.css";
import { slide as Menu } from "react-burger-menu";
import { Icon } from "react-icons-kit";
import { dashboard } from "react-icons-kit/fa/dashboard";
import { graph } from "react-icons-kit/iconic/graph";
import { bullseye } from "react-icons-kit/ikons/bullseye";
import { ic_attach_money } from "react-icons-kit/md/ic_attach_money";
import { ic_forum } from "react-icons-kit/md/ic_forum";
import { NavLink } from "react-router-dom";

export default class SideBar extends React.Component {
    handleClick = event => {
        event.preventDefault();
    };
    render() {
        return (
            <Menu>

                <NavLink className="menu-item" to="/budget">
                    <Icon id="icon" icon={ic_attach_money} />
                    Budget Category
                </NavLink>

                <NavLink className="menu-item" to="/goal">
                    <Icon id="icon" icon={bullseye} />
                    Goals
                </NavLink>

                <NavLink className="menu-item" to="/report">
                    <Icon id="icon" icon={graph} />
                    Reports
                </NavLink>
                <NavLink className="menu-item" to="/transaction">
                    <Icon id="icon" icon={graph} />
                    Transaction
                </NavLink>

                
                
            </Menu>
        );
    }
}
