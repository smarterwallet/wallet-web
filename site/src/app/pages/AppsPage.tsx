import React from 'react';
import './AppsPage.css';
import { NavLink } from 'react-router-dom';

class AppsPage extends React.Component {

  renderApp(icon: string, name: string, to: string) {
    return (
      <NavLink className='apps-page-app-row' to={to}>
        <img className="apps-page-app-icon" src={icon} />
        <div className="apps-page-app-name">{name}</div>
      </NavLink>
    );
  }

  render() {
    return (
      <div className="apps-page">
        <div className="apps-page-header">Apps</div>
        <div className='apps-page-title'>Account Interaction Apps</div>
        <div className='apps-page-app-container'>
          {this.renderApp('/icon/batch.png', 'Simple Transactions', '/simpleTransaction')}
          {this.renderApp('/icon/auto-trading.png', 'Automatic Trading', '')}
          {/*{this.renderApp('/icon/auto-trading.png', 'Automatic Trading', '/autoTrade')}*/}
          {this.renderApp('/icon/p2p.png', 'P2P Matching & Trading', '')}
        </div>

        <div className='apps-page-title'>Account Management Apps</div>
        <div className='apps-page-app-container'>
          {this.renderApp('/icon/login.png', 'Login & Register', '/register')}
          {this.renderApp('/icon/access.png', 'Access Control', '')}
          {this.renderApp('/icon/security.png', 'Security Privacy', '')}
        </div>

        <div className='apps-page-title'>Decentralized Apps</div>
        <div className='apps-page-app-container'>
          {this.renderApp('/icon/defi.png', 'DeFi', '')}
          {this.renderApp('/icon/gamefi.png', 'GameFi', '')}
          {this.renderApp('/icon/social-app.png', 'Social', '')}
        </div>

        <div className='apps-page-title'>Wallet Apps</div>
        <div className='apps-page-app-container'>
          {this.renderApp('/icon/tutorial.png', 'Tutorial', '')}
          {this.renderApp('/icon/news.png', 'News', '')}
          {this.renderApp('/icon/community.png', 'Community', '')}
        </div>
      </div>
    );
  }
}

export default AppsPage;