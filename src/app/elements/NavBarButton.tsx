import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

interface NavBarButtonProps {
  icon:string,
  text:string,
  to:string,
  align?:string
}

class NavBarButton extends React.Component<NavBarButtonProps, {}> {
  constructor(props: NavBarButtonProps) {
    super(props);
  }

  render() {
    return (
      <NavLink className={({ isActive }) => (isActive ? "navbar-link-active" : "navbar-link")} to={this.props.to}>
        <div className="navbar-button">
          <img className="navbar-button-icon" src={this.props.icon}></img>
          <div className="navbar-button-text">{this.props.text}</div>
        </div>
      </NavLink>
    );
  }
}

export default NavBarButton;