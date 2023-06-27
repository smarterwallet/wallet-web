import React from 'react';
import './AssetPage.css';
import HeaderBar from '../elements/HeaderBar';

interface AssetPageState {
  assetId: string;
  assetIcon: string;
  filter: number;
}

class AssetPage extends React.Component<{}, AssetPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      assetId: '',
      assetIcon: '',
      filter: 0
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

    this.setState({assetId, assetIcon});
  }

  render() {
    return (
      <div className="asset-page">
        <HeaderBar text={this.state.assetId} />

        <div className='asset-page-header'>
          <img className="asset-page-image" src={this.state.assetIcon} />
          <div className="asset-page-asset">0.00 {this.state.assetId}</div>
          <div className="asset-page-usd">$0.00</div>
        </div>

        <div className='asset-page-title'>Transactions</div>
        <div className='asset-page-filter-container'>
          <div
            className={`asset-page-filter ${this.state.filter === 0 && 'selected'}`}
            onClick={()=>this.setState({filter: 0})}>All</div>
          <div
            className={`asset-page-filter ${this.state.filter === 1 && 'selected'}`}
            onClick={()=>this.setState({filter: 1})}>Sent</div>
          <div
            className={`asset-page-filter ${this.state.filter === 2 && 'selected'}`}
            onClick={()=>this.setState({filter: 2})}>Received</div>
        </div>

        <div className='asset-page-trans'>None</div>
      </div>
    );
  }
}

export default AssetPage;