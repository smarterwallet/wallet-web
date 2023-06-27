import React from 'react';
import './HomePage.css';
import { NavLink } from 'react-router-dom';

class HomePage extends React.Component {

  renderAsset(icon: string, name: string, amount: number, usd: number) {
    return (
      <NavLink className='home-page-asset-row' to={'/asset/' + name}>
        <img className="home-page-asset-icon" src={icon} />
        <div className="home-page-asset-name">{name}</div>
        <div>
          <div className="home-page-asset-amount">{amount.toFixed(2)}</div>
          <div className="home-page-asset-usd">${usd.toFixed(2)}</div>
        </div>
      </NavLink>
    );
  }

  render() {
    return (
      <div className="home-page">
        <div className="home-page-header">
          <img className="home-page-header-icon" src="/icon/portrait.png" />
          <div>
            <div className="home-page-header-username">Username</div>
            <div className="home-page-header-address">0x6...ae4</div>
          </div>
          <select
            className="home-page-header-select" 
            // value={this.state.category} 
            // onChange={this.onCategoryChange}
            // disabled={this.state.loading}
          >
            <option value="main">Main</option>
            <option value="testnet">Testnet</option>
          </select>
          <img className="home-page-icon-logout" src="/icon/logout.png" />
        </div>

        <div className='home-page-balance-container'>
          <div className="home-page-balance-title">Account Balance</div>
          <div className="home-page-balance">$ 0.00</div>
        </div>

        <div>
          {this.renderAsset('/icon/btc.png', 'BTC', 0, 0)}
          {this.renderAsset('/icon/eth.png', 'ETH', 0, 0)}
          {this.renderAsset('/icon/usdc.png', 'USDC', 0, 0)}
        </div>

        <br/>
        {/* <div>Transactions</div> */}
      </div>
    );
  }
}

export default HomePage;