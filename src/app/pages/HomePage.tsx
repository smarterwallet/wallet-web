import React from 'react';
import './HomePage.css';
import {Navigate, NavLink} from 'react-router-dom';
import {Server} from '../../server/server';
import {BsFiles} from 'react-icons/bs';
import {Asset, Config} from "../../server/config";
import QuestionModal from "../modals/QuestionModal";
import AlertModal from "../modals/AlertModal";

const polygonConfig = require('../config/polygon.json');
const polygonMumbaiConfig = require('../config/polygon-mumbai.json');

interface AssetInfo {
  asset: Asset;
  amount: string;
  sort: number;
}

interface HomePageState {
  message: string;
  question: string;
  alert: string;
  asset: { [key: string]: AssetInfo };
}

class HomePage extends React.Component<{}, HomePageState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      message: '',
      question: '',
      alert: '',
      asset: {},
    };

    this.onQuestionYes = this.onQuestionYes.bind(this);
    this.onQuestionNo = this.onQuestionNo.bind(this);
  }

  componentDidMount(): void {
    let newAsset = {...this.state.asset};
    for (let key in Config.TOKENS) {
      newAsset[key] = {
        asset: Config.TOKENS[key],
        amount: "loading",
        sort: Config.TOKENS[key].sort
      };
    }

    this.setState({asset: newAsset});
    this.flushAsset();
  }

  async flushAsset() {
    if (Server.account.contractAddress) {
      let newAsset: {[key: string]: any}  = {};
      for (let key in Config.TOKENS) {
        if(Config.TOKENS[key] !== undefined && Config.TOKENS[key] !== null){
          const balance = await Server.account.getBalanceOf(Config.TOKENS[key]);
          newAsset[key] = {
            asset: Config.TOKENS[key],
            amount: balance,
            sort: Config.TOKENS[key].sort
          };
        }
      }

      this.setState({asset: newAsset});
    }
  }

  onQuestionYes() {
    Server.account.loggedOut()
    this.forceUpdate();
  }

  onQuestionNo() {
    this.setState({question: ''});
  }

  renderAsset(key: string, icon: string, name: string, amount: string, usd: number) {
    return (
        <div key={key}>
          <NavLink className='home-page-asset-row' to={'/asset/' + name}>
            <img className="home-page-asset-icon" src={icon}/>
            <div className="home-page-asset-name">{name}</div>
            <div>
              <div
                  className="home-page-asset-amount">{Number.isNaN(Number(amount)) ? amount : Number(amount).toFixed(2)}</div>
              <div className="home-page-asset-usd">${usd.toFixed(2)}</div>
            </div>
          </NavLink>
        </div>
    );
  }

  onLogout() {
    this.setState({question: 'Are you sure you want to log out?'});
  }

  async copyUrl() {
    await navigator.clipboard.writeText(Server.account.contractAddress);
  }

  async flushConfig(chainName: string) {
    console.log("start to flush. Chain name: " + chainName);
    switch (chainName) {
      case "Polygon":
        await Config.flushConfig(JSON.stringify(polygonConfig));
        await this.flushAsset();
        break;
      case "Mumbai":
        await Config.flushConfig(JSON.stringify(polygonMumbaiConfig));
        await this.flushAsset();
        break;
    }
  }

  render() {
    if (!Server.account.isLoggedIn()) {
      return <Navigate to="/" replace/>;
    }

    let address = '';
    let username = localStorage.getItem('username');
    let val = Server.account.contractAddress;
    if (val) address = val;
    if (address.length > 10) {
      address = address.substring(0, 5) + '...' + address.substring(address.length - 4);
    }

    return (
      <div className="home-page">
        <div className="home-page-header">
          <img className="home-page-header-icon" src="/icon/portrait.png" />
          <div>
            <div className="home-page-header-username">{username}</div>
            <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={() => this.copyUrl()}>
              <div className="home-page-header-address">{address}</div>
              <BsFiles color='gray'/>
            </div>
          </div>
          <select
              className="home-page-header-select"
              onChange={async event => await this.flushConfig(event.target.value)}
          >
            <option value="Mumbai">Mumbai
            </option>
            {/*<option value="Polygon">Polygon*/}
            {/*</option>*/}
          </select>
          <img className="home-page-icon-logout" src="/icon/logout.png" onClick={() => this.onLogout()}/>
        </div>

        <div className='home-page-balance-container'>
          <div className="home-page-balance-title">Account Balance</div>
          <div className="home-page-balance">$ 0.00</div>
        </div>

        <div>
          {Object.entries(this.state.asset).sort(([, assetInfoA], [, assetInfoB]) => assetInfoA.sort - assetInfoB.sort)
              .map(([key, assetInfo], index) => (
                  this.renderAsset(key, assetInfo.asset.icon, assetInfo.asset.name, assetInfo.amount, 0)
              ))}
        </div>

        <br/>

        <AlertModal message={this.state.alert} button="OK" onClose={() => this.setState({alert: ''})}/>
        <QuestionModal message={this.state.question} onYes={this.onQuestionYes} onNo={this.onQuestionNo}/>
      </div>
    );
  }
}

export default HomePage;