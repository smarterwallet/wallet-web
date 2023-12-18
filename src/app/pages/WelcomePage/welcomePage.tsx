import React from 'react';
import './styles.css';
import { Navigate, NavLink } from 'react-router-dom';
import { Global } from '../../../server/Global';

class WelcomePage extends React.Component {
  render() {
    if (Global.account.isLoggedIn) return <Navigate to="/home" replace />;

    return (
      <div className="welcome-page">
        <div className="welcome-page-header">
          <img className="welcome-page-header-icon" src="/icon/wallet.png" />
          <div className="welcome-page-header-text">Welcome!</div>
        </div>

        <div className="welcome-page-title">
          Enjoy countless capable and decentralized third-party account applications via account abstraction!
        </div>

        <NavLink className="welcome-page-button-container" to="/signup">
          <div className="welcome-page-button-text">Sign up</div>
          <img className="welcome-page-button-icon" src="/icon/arrow-right.png" />
        </NavLink>

        <NavLink className="welcome-page-button-container" to="/signin">
          <div className="welcome-page-button-text">Login</div>
          <img className="welcome-page-button-icon" src="/icon/arrow-right.png" />
        </NavLink>

        <div className="mh-8"></div>
      </div>
    );
  }
}

export default WelcomePage;
