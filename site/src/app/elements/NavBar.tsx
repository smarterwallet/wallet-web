import React from 'react';
import { Server } from '../../server/server';
import NavBarButton from './NavBarButton';
import './NavBar.css';
import { AppConfig } from '../AppConfig';
import { getMenuIcon } from '../util/util';

class NavBar extends React.Component {

  renderButton(menu: any) {
    return (
      <NavBarButton key={menu.text} icon={getMenuIcon(menu.icon)} text={menu.text} to={menu.to} />
    )
  }

  render() {
    let buttons = [];
    let menu = AppConfig.menu;

    for (let i = 0; i < menu.length; i++) {
      buttons.push(this.renderButton(menu[i]));
    }
    
    return (
      <nav>
        <div className="navbar-container">
          {buttons}
        </div>
      </nav>
    );
  }
}

export default NavBar;