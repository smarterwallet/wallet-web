import React from 'react';
import './WelcomePage.css';
import { NavLink, Navigate } from 'react-router-dom';
import { Server } from '../../server/server';

class WelcomePage extends React.Component {
  render() {
    if (Server.account.isLoggedIn())
      return <Navigate to="/home" replace />;

    return (
      <div className="welcome-page">
        <div className="welcome-page-header">
          <img className="welcome-page-header-icon" src="/icon/wallet.png" />
          <div className="welcome-page-header-text">Welcome!</div>
        </div>

        <div className="welcome-page-title">
          Enjoy countless capable and decentralized third-party account applications via account abstraction!
        </div>

        <NavLink className="welcome-page-button-container" to='/register'>
          <div className="welcome-page-button-text">Register an account</div>
          <img className="welcome-page-button-icon" src="/icon/arrow-right.png" />
        </NavLink>

        <NavLink className="welcome-page-button-container" to='/login'>
          <div className="welcome-page-button-text">Login</div>
          <img className="welcome-page-button-icon" src="/icon/arrow-right.png" />
        </NavLink>
      </div>
    );
  }
}

export default WelcomePage;