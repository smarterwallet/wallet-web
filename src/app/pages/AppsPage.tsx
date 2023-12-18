import React from 'react';
import './AppsPage.css';
import { NavLink, Navigate } from 'react-router-dom';
import { Global } from '../../server/Global';
import { message } from 'antd';
import SwitchDemandApp from '../component/SwitchDemandApp';

const AppsPage = () => {

  const renderApp = (icon: string, name: string, to: string) => {
    return (
      <NavLink className='apps-page-app-row' to={to}>
        <img className="apps-page-app-icon" src={icon} />
        <div className="apps-page-app-name">{name}</div>
      </NavLink>
    );
  }

  if (!Global.account.isLoggedIn) {
    message.error("Please login first");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="apps-page">
      <SwitchDemandApp to="/demand"/>
      <div className="apps-page-header">Apps</div>
      <div className='apps-page-title'>Account Interaction Apps</div>
      <div className='apps-page-app-container'>
        {renderApp('/icon/batch.png', 'Simple Transactions', '/simpleTransaction')}
        {renderApp('/icon/auto-trading.png', 'Automatic Trading', '/automaticTrading')}
        {/*{renderApp('/icon/auto-trading.png', 'Automatic Trading', '/autoTrade')}*/}
        {renderApp('/icon/p2p.png', 'P2P Matching & Trading', '')}
      </div>

      <div className='apps-page-title'>Account Management Apps</div>
      <div className='apps-page-app-container'>
        {renderApp('/icon/login.png', 'Sign in & Sign up', '/signup')}
        {renderApp('/icon/access.png', 'Access Control', '')}
        {renderApp('/icon/security.png', 'Security Privacy', '')}
      </div>

      <div className='apps-page-title'>Decentralized Apps</div>
      <div className='apps-page-app-container'>
        {renderApp('/icon/defi.png', 'DeFi', '')}
        {renderApp('/icon/gamefi.png', 'GameFi', '')}
        {renderApp('/icon/social-app.png', 'Social', '')}
      </div>

      <div className='apps-page-title'>Wallet Apps</div>
      <div className='apps-page-app-container'>
        {renderApp('/icon/tutorial.png', 'Tutorial', '')}
        {renderApp('/icon/news.png', 'News', '')}
        {renderApp('/icon/community.png', 'Community', '')}
      </div>
    </div>
  )
}

export default AppsPage;
