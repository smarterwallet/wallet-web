import React from 'react';
import './WelcomePage.css';
import { NavLink } from 'react-router-dom';

class WelcomePage extends React.Component {
  render() {
    return (
      <div className="welcome-page">
        <div className="welcome-page-header">
          <img className="welcome-page-header-icon" src="/icon/wallet.png" />
          <div className="welcome-page-header-text">Welcome!</div>
        </div>

        <div className="welcome-page-title">
          Enjoy countless capable and decentralized third-party smart contract account applications here
        </div>

        <NavLink className="welcome-page-action-container" to='/register'>
          <div className="welcome-page-action-text">
            Choose a way to register with any account applications
          </div>
          <img className="welcome-page-action-icon" src="/icon/arrow-right.png" />
        </NavLink>
      </div>
    );
  }
}

export default WelcomePage;