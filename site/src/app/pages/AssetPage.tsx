import React from 'react';
import './AssetPage.css';
import HeaderBar from '../elements/HeaderBar';
import {Server} from "../../server/server";
import {NavLink} from "react-router-dom";

interface AssetPageState {
  assetId: string;
  assetIcon: string;
  filter: number;
  txData: any;
}

class AssetPage extends React.Component<{}, AssetPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      assetId: '',
      assetIcon: '',
      filter: 0,
      txData: null,
    }


  }

  componentDidMount(): void {
    let assetId = window.location.pathname.substring(7);

    let assetIcon;
    if (assetId === "BTC")
      assetIcon = '/icon/btc.png';
    else if (assetId === "ETH")
      assetIcon = '/icon/eth.png';
    else if (assetId === "USDC")
      assetIcon = '/icon/usdc.png';
    else if (assetId === "USDTPM") {
      assetIcon = '/icon/usdc.png';
      this.getTokenTxList().then((e) => {
        this.setState({txData: e});
      })
    } else if (assetId === "MATIC") {
      assetIcon = '/icon/matic.png';
      this.getMaticList().then((e) => {
        this.setState({txData: e});
      })
    }


    this.setState({assetId, assetIcon});
  }

  async getMaticList() {
    let txList = await Server.account.getMaticTxList(Server.account.contractAddress);
    console.log(txList);
  }

  async getTokenTxList() {
    let txList = await Server.account.getTokenTxList(Server.account.contractAddress);
    console.log(txList);
  }

  render() {
    return (
        <div className="asset-page">
          <HeaderBar text={this.state.assetId}/>

          <div className='asset-page-header'>
            <img className="asset-page-image" src={this.state.assetIcon}/>
            <div className="asset-page-asset">0.00 {this.state.assetId}</div>
            <div className="asset-page-usd">$0.00</div>
          </div>

          <div className='asset-page-title'>Transactions</div>
          <div className='asset-page-filter-container'>
            <div
                className={`asset-page-filter ${this.state.filter === 0 && 'selected'}`}
                onClick={() => this.setState({filter: 0})}>All
            </div>
            <div
                className={`asset-page-filter ${this.state.filter === 1 && 'selected'}`}
                onClick={() => this.setState({filter: 1})}>Sent
            </div>
            <div
                className={`asset-page-filter ${this.state.filter === 2 && 'selected'}`}
                onClick={() => this.setState({filter: 2})}>Received
            </div>
          </div>

          <div className='asset-page-trans'>
            {/*<NavLink className='home-page-asset-row' to={'/tx/'}>*/}
            {/*  /!*<img className="home-page-asset-icon" src={icon} />*!/*/}
            {/*  <div className="home-page-asset-name">123</div>*/}
            {/*  <div>*/}
            {/*    <div className="home-page-asset-amount">2</div>*/}
            {/*    <div className="home-page-asset-usd">1</div>*/}
            {/*  </div>*/}
            {/*</NavLink>*/}
            Coming Soon
          </div>
        </div>
    );
  }
}

export default AssetPage;