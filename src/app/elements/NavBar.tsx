import React from 'react';
import NavBarButton from './NavBarButton';
import './NavBar.scss';
import {AppConfig} from '../AppConfig';
import {getMenuIcon} from '../util/util';
import { useLocation } from 'react-router-dom';

const NavBar = () => {

  const location = useLocation();
  console.log(location, 'navigate')
  const isWelComePage = location.pathname === '/';

  const renderButton = (menu: any) => {
    return (
      <NavBarButton key={menu.text} icon={menu.icon} text={menu.text} to={menu.to} />
    )
  }


  let buttons = [];
  let menu = AppConfig.menu;

  for (let i = 0; i < menu.length; i++) {
    buttons.push(renderButton(menu[i]));
  }

  return (
    <nav className={`${isWelComePage ? 'ww-welcome-nav' : ''} ww-bottom-nav`}>
      <div className="navbar-container">
        {buttons}
      </div>
    </nav>
  );

}

export default NavBar;