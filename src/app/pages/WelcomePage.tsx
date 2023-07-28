import React from 'react';
import './WelcomePage.css';
import { NavLink, Navigate } from 'react-router-dom';
import { Global } from '../../server/Global';
import SWCell from '../component/SWCell';

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

        <div className="mt-8">
          <SWCell text="Register a smart contract account" to="/register/accountType" shadow={true} />
        </div>
        <div className="mt-8">
          <SWCell text="Login" to="/login" shadow={true} />
        </div>

        <div className="mh-8"></div>
      </div>
    );
  }
}

export default WelcomePage;
