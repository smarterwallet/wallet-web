import React from 'react';
import './HomePage.css';
import { Navigate, NavLink } from 'react-router-dom';
import { Global } from '../../server/Global';
import { BsFiles } from 'react-icons/bs';
import { Asset, Config } from '../../server/config/Config';
import QuestionModal from '../modals/QuestionModal';
import AlertModal from '../modals/AlertModal';
import { message } from 'antd';
import { ethers } from 'ethers';

const polygonConfig = require('../config/polygon.json');
const fujiConfig = require('../config/fuji.json');
const moonbaseConfig = require('../config/moonbase.json');
const polygonMumbaiConfig = require('../config/mumbai.json');

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
  intervalId: NodeJS.Timeout | null;
}

class HomePage extends React.Component<{}, HomePageState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      message: '',
      question: '',
      alert: '',
      asset: {},
      intervalId: null,
    };

    this.onQuestionYes = this.onQuestionYes.bind(this);
    this.onQuestionNo = this.onQuestionNo.bind(this);
  }

  componentDidMount(): void {
    this.setState({ intervalId: setInterval(this.flushAsset, 2000) });
    this.init();
  }

  async init() {
    console.log(Global.account.contractWalletAddress);
    let newAsset = { ...this.state.asset };
    for (let key in Config.TOKENS) {
      newAsset[key] = {
        asset: Config.TOKENS[key],
        amount: 'loading',
        sort: Config.TOKENS[key].sort,
      };
    }
    this.setState({ asset: newAsset });

    await this.flushAsset();
  }

  async saveAddress() {
    await Config.init(JSON.stringify(fujiConfig));
    await Global.init();
    localStorage.setItem('fujiAddress', Global.account.contractWalletAddress);
    await Config.init(JSON.stringify(polygonMumbaiConfig));
    await Global.init();
    localStorage.setItem('mumbaiAddress', Global.account.contractWalletAddress);
  }

  flushAsset = async () => {
    if (Global.account.contractWalletAddress != null && Global.account.contractWalletAddress !== '') {
      localStorage.setItem(Config.CURRENT_CHAIN_NAME.toLowerCase() + 'Address', Global.account.contractWalletAddress);
      let promises = [];
      for (let key in Config.TOKENS) {
        if (Config.TOKENS[key] !== undefined && Config.TOKENS[key] !== null) {
          promises.push(
            Global.account.getBalanceOf(Config.TOKENS[key]).then((balance) => {
              console.log('key', key, balance, Global.account);
              return {
                key: key,
                asset: Config.TOKENS[key],
                amount: balance,
                sort: Config.TOKENS[key]?.sort,
              };
            }),
          );
        }
      }

      let results = await Promise.all(promises);
      let newAsset: any = {};
      for (let result of results) {
        newAsset[result.key] = result;
      }

      this.setState({ asset: newAsset });
    } else {
      console.log("first login can't read global.account.contractWalletAddress");
    }
  };

  onQuestionYes() {
    // Global.account.isLoggedIn = false;
    this.forceUpdate();
  }

  onQuestionNo() {
    this.setState({ question: '' });
  }

  renderAsset(key: string, icon: string, name: string, amount: string, usd: number) {
    return (
      <div key={key}>
        <NavLink className="home-page-asset-row" to={'/asset/' + name}>
          <img className="home-page-asset-icon" src={icon} />
          <div className="home-page-asset-name">{name}</div>
          <div>
            <div className="home-page-asset-amount">
              {Number.isNaN(Number(amount)) ? amount : Number(amount).toFixed(2)}
            </div>
            <div className="home-page-asset-usd">${usd.toFixed(2)}</div>
          </div>
        </NavLink>
      </div>
    );
  }

  onLogout() {
    this.setState({ question: 'Are you sure you want to sign out?' });
  }

  async copyUrl() {
    message.success('Public address copied to clipboard');
    await navigator.clipboard.writeText(Global.account.contractWalletAddress);
  }

  async flushConfigAndAsset(chainName: string) {
    console.log('start to flush. Chain name: ' + chainName);

    Config.CURRENT_CHAIN_NAME = chainName;
    switch (chainName.toLowerCase()) {
      case 'polygon':
        await Config.init(JSON.stringify(polygonConfig));
        await Global.init();
        await this.flushAsset();
        break;
      case 'mumbai':
        await Config.init(JSON.stringify(polygonMumbaiConfig));
        await Global.init();
        await this.flushAsset();
        break;
      case 'avax fuji':
        await Config.init(JSON.stringify(fujiConfig));
        await Global.init();
        await this.flushAsset();
        break;
      case 'moonbase':
        await Config.init(JSON.stringify(moonbaseConfig));
        await Global.init();
        await this.flushAsset();
    }
  }

  render() {
    if (!Global.account.isLoggedIn) {
      return <Navigate to="/" replace />;
    }

    let address = '';
    let username = localStorage.getItem('username');
    let val = Global.account.contractWalletAddress;
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
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => this.copyUrl()}>
              <div className="home-page-header-address">{address}</div>
              <BsFiles color="gray" />
            </div>
          </div>
          <select
            defaultValue={Config.CURRENT_CHAIN_NAME}
            className="home-page-header-select"
            onChange={async (event) => {
              localStorage.setItem('pk', Global.account.ethersWallet.privateKey);
              this.setState({ alert: 'Switch to ' + event.target.value + '...' });
              await this.flushConfigAndAsset(event.target.value);
              this.setState({ alert: '' });
            }}
          >
            <option value="Polygon">Polygon</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Avax Fuji">Avax Fuji</option>
            <option value="Moonbase">Moonbase</option>
          </select>
          <img className="home-page-icon-logout" src="/icon/logout.png" onClick={() => this.onLogout()} />
        </div>

        <div className="home-page-balance-container">
          <div className="home-page-balance-title">Account Balance</div>
          <div className="home-page-balance">$ 0.00</div>
        </div>

        <div>
          {Object.entries(this.state.asset)
            .sort(([, assetInfoA], [, assetInfoB]) => assetInfoA.sort - assetInfoB.sort)
            .map(([key, assetInfo], index) =>
              this.renderAsset(key, assetInfo.asset?.icon, assetInfo.asset?.name, assetInfo?.amount, 0),
            )}
        </div>

        <br />

        <AlertModal message={this.state.alert} button={null} onClose={() => this.setState({ alert: '' })} />
        <QuestionModal message={this.state.question} onYes={this.onQuestionYes} onNo={this.onQuestionNo} />
      </div>
    );
  }
}

export default HomePage;
