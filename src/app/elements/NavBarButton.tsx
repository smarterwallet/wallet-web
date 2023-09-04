import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './NavBar.scss';

interface NavBarButtonProps {
  icon: React.ReactElement;
  text:string;
  to:string;
  match: RegExp;
}


const NavBarButton = (props: NavBarButtonProps) => {
  const location = useLocation();
  const active = props.match ? location.pathname.match(props.match) : props.to === location.pathname;
  return (
    <NavLink className={active ? "navbar-link-active" : "navbar-link"} to={props.to}>
      <div className="navbar-button">
        <div className="navbar-icon-wrap">
          {props.icon}
        </div>
        <div className="navbar-button-text">{props.text}</div>
      </div>
    </NavLink>
  )
}

export default NavBarButton;