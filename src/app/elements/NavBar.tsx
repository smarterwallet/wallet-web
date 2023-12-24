import React from 'react';
import NavBarButton from './NavBarButton';
import './NavBar.scss';
import { AppConfig } from '../AppConfig';
import { useLocation } from 'react-router-dom';

const excludePath = ['/demandchat'];

const NavBar = () => {
  const location = useLocation();
  const isWelComePage = location.pathname === '/';
  console.log(location, 666);

  return (
    <>
      {!excludePath.includes(location.pathname) && (
        <nav className={`${isWelComePage ? 'ww-welcome-nav' : ''} ww-bottom-nav`}>
          <div className="navbar-container">
            {AppConfig.menu.map((menu) => {
              return <NavBarButton key={menu.text} icon={menu.icon} text={menu.text} to={menu.to} match={menu.match} />;
            })}
          </div>
        </nav>
      )}
    </>
  );
};

export default NavBar;
