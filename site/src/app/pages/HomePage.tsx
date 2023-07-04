import React from 'react';
import './HomePage.css';
import { NavLink, Navigate } from 'react-router-dom';
import { Server } from '../../server/server';
import QuestionModal from '../modals/QuestionModal';
import { BsFiles } from 'react-icons/bs';

interface HomePageState {
  message: string;
  question: string;
  alert: string;
  matic: string;
  usdtpm: string;
}

class HomePage extends React.Component<{}, HomePageState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      message: '',
      question: '',
      alert: '',
      matic: '',
      usdtpm: '',
    };

    this.onQuestionYes = this.onQuestionYes.bind(this);
    this.onQuestionNo = this.onQuestionNo.bind(this);
  }

  componentDidMount(): void {
    this.getBalance();
  }

  async getBalance() {
    let address  = Server.account.contractAddress;

    if (address) {
      let matic  = await Server.account.balanceOfMATIC(address);
      let usdtpm = await Server.account.balanceOfUSDTPM(address);
      this.setState({ matic, usdtpm });
    }
  }

  onQuestionYes() {
    Server.account.loggedOut()
    this.forceUpdate();
  }

  onQuestionNo() {
    this.setState({question: ''});
  }

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

  onLogout() {
    this.setState({question: 'Are you sure you want to log out?'});
  }

  async copyUrl() {
    await navigator.clipboard.writeText(Server.account.contractAddress);
  }

  render() {
    if(!Server.account.isLoggedIn())
      return <Navigate to="/" replace />;
      
    let address = '';
    let username = localStorage.getItem('username');
    let val = Server.account.contractAddress;
    if (val) address = val;
    if (address.length > 10)
      address = address.substring(0, 5) + '...' + address.substring(address.length - 4);

    return (
      <div className="home-page">
        <div className="home-page-header">
          <img className="home-page-header-icon" src="/icon/portrait.png" />
          <div>
            <div className="home-page-header-username">{username}</div>
            <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={() => this.copyUrl()}>
              <div className="home-page-header-address">{address}</div>
              <BsFiles color='gray' />
            </div>
          </div>
          <select
            className="home-page-header-select" 
            // value={this.state.category} 
            // onChange={this.onCategoryChange}
            // disabled={this.state.loading}
          >
            <option value="main">Mumbai</option>
            <option value="testnet">Mainnet</option>
          </select>
          <img className="home-page-icon-logout" src="/icon/logout.png" onClick={()=>this.onLogout()} />
        </div>

        <div className='home-page-balance-container'>
          <div className="home-page-balance-title">Account Balance</div>
          <div className="home-page-balance">$ 0.00</div>
        </div>

        <div>
          {this.renderAsset('/icon/matic.png', 'MATIC', Number(this.state.matic), 0)}
          {this.renderAsset('/icon/usdc.png', 'USDTPM', Number(this.state.usdtpm), 0)}
        </div>

        <br/>
        {/* <div>Transactions</div> */}

        <QuestionModal message={this.state.question} onYes={this.onQuestionYes} onNo={this.onQuestionNo} />
      </div>
    );
  }
}

export default HomePage;