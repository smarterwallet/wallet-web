import React from 'react';
import './AssetPage.css';
import HeaderBar from '../elements/HeaderBar';
import { Global } from "../../server/Global";
import { divideAndMultiplyByTenPowerN, formatTimestamp, handlerNumberStr } from "../util/util";
import { ethers } from "ethers";
import { Navigate } from "react-router-dom";
import { Asset, Config } from "../../server/config/Config";

interface AssetPageState {
  assetId: string;
  assetIcon: string;
  balance: string;
  filter: number;
  txData: any;
  txDataFrom: any;
  txDataTo: any;
  txDataToShow: any;
}

class AssetPage extends React.Component<{}, AssetPageState> {

  constructor(props: any) {
    super(props);

    this.state = {
      assetId: '',
      assetIcon: '',
      balance: '',
      filter: 0,
      txData: null,
      txDataFrom: null,
      txDataTo: null,
      txDataToShow: null,
    }

  }

  componentDidMount(): void {
    let assetId = window.location.pathname.substring(7);
    let asset = Config.TOKENS[assetId];
    let assetIcon = asset.icon;
    this.setState({ assetId, assetIcon });
    if (asset.type === 1) {
      this.getMainTokenList().then((e) => {
        this.setState({ txDataTo: e.txListTo });
        this.setState({ txDataFrom: e.txListFrom });
        this.setState({ txData: e.mergedArray });
        this.setState({ txDataToShow: e.mergedArray });
      })
      Global.account.getBalanceOfMainToken(Global.account.contractWalletAddress, asset.decimals).then((e) => {
        this.setState({ balance: handlerNumberStr(e).toString() })
      })
    } else if (asset.type === 2) {
      this.getTokenTxList(Config.TOKENS[assetId]).then((e) => {
        this.setState({ txDataTo: e.txListTo });
        this.setState({ txDataFrom: e.txListFrom });
        this.setState({ txData: e.mergedArray });
        this.setState({ txDataToShow: e.mergedArray });
      })
      Global.account.getBalanceOfERC20(asset.address, Global.account.contractWalletAddress, asset.decimals).then((e) => {
        this.setState({ balance: handlerNumberStr(e).toString() })
      })
    }
  }

  async getMainTokenList() {
    let txListResponse = await Global.account.getMainTokenTxList();
    let txInternalListResponse = await Global.account.getMainTokenInternalTxList();
    let allResultsConcat = txListResponse.body["result"].concat(txInternalListResponse.body["result"])
    // 去重
    let allResult = allResultsConcat.filter((value: { blockNumber: any; from: any; hash: any, to: any; traceId: any; value: any; }, index: any, self: any[]) =>
      self.findIndex(item => (
        item.blockNumber === value.blockNumber
        && item.from === value.from
        && item.hash === value.hash
        && item.to === value.to
        && item.traceId === value.traceId
        && item.value === value.value
      )) === index
    );
    let txListFrom: any[] = [];
    let txListTo: any[] = [];

    allResult.forEach((item: any) => {
      let valueStr = handlerNumberStr(ethers.utils.formatUnits(item.value));
      if (valueStr === 0) {
        return;
      }
      let data = {
        ...item,
        valueShow: valueStr,
        txTimeShow: formatTimestamp(item.timeStamp, true),
        txHashShow: item.hash,
      };
      if (item.from.toLowerCase() === Global.account.contractWalletAddress.toLowerCase()) {
        data.txType = "Sent";
        txListFrom.push(data);
      } else if (item.to.toLowerCase() === Global.account.contractWalletAddress.toLowerCase()) {
        data.txType = "Received";
        txListTo.push(data);
      }
    })

    txListFrom = txListFrom.filter((item: any) => item != null);
    txListTo = txListTo.filter((item: any) => item != null);
    let mergedArray = txListFrom.concat(txListTo);
    mergedArray = mergedArray.filter((item: any) => {
      if (typeof item === 'object' && item !== null) {
        return Object.keys(item).length > 0;
      }
      return true;
    });

    // sort all result
    mergedArray.sort((a: any, b: any) => b.timeStamp - a.timeStamp);

    // console.log({txListTo, txListFrom, mergedArray});
    return { txListTo, txListFrom, mergedArray }
  }

  async getTokenTxList(asset: Asset) {
    let txListFromResponse = await Global.account.getTokenTxListFromThisAddr(asset.address);
    let txListFrom = txListFromResponse.body["result"].map((item: any) => {
      let valueStr = handlerNumberStr(divideAndMultiplyByTenPowerN(ethers.BigNumber.from(item.data).toString(), asset.decimals));
      if (valueStr === 0) {
        return {};
      }
      return {
        ...item,
        txType: "Sent",
        valueShow: valueStr,
        txTimeShow: formatTimestamp(parseInt(item.timeStamp, 16), true),
        txHashShow: item.transactionHash,
      };
    });

    let txListToResponse = await Global.account.getTokenTxListToThisAddr(asset.address);
    let txListTo = txListToResponse.body["result"].map((item: any) => {
      if (null === item.data) {
        return {};
      }
      let valueStr = handlerNumberStr(divideAndMultiplyByTenPowerN(ethers.BigNumber.from(item.data).toString(), asset.decimals));
      if (valueStr === 0) {
        return {};
      }
      return {
        ...item,
        txType: "Received",
        valueShow: valueStr,
        txTimeShow: formatTimestamp(parseInt(item.timeStamp, 16), true),
        txHashShow: item.transactionHash,
      };
    });

    txListFrom = txListFrom.filter((item: any) => item != null)
    txListTo = txListTo.filter((item: any) => item != null)
    let mergedArray = txListFrom.concat(txListTo);
    mergedArray = mergedArray.filter((item: any) => {
      if (typeof item === 'object' && item !== null) {
        return Object.keys(item).length > 0;
      }
      return true;
    });

    // sort all result
    txListFrom.sort((a: any, b: any) => parseInt(b.timeStamp, 16) - parseInt(a.timeStamp, 16));
    txListTo.sort((a: any, b: any) => parseInt(b.timeStamp, 16) - parseInt(a.timeStamp, 16));
    mergedArray.sort((a: any, b: any) => parseInt(b.timeStamp, 16) - parseInt(a.timeStamp, 16));

    // console.log({ txListTo, txListFrom, mergedArray });
    return { txListTo, txListFrom, mergedArray }
  }


  handleFilterChange(filter: number) {
    this.setState({ filter }, () => {
      if (filter === 0) {
        this.setState({ txDataToShow: this.state.txData });
      } else if (filter === 1) {
        this.setState({ txDataToShow: this.state.txDataFrom });
      } else {
        this.setState({ txDataToShow: this.state.txDataTo });
      }
    });
  }

  render() {
    if (!Global.account.isLoggedIn)
      return <Navigate to="/" replace />;

    return (
      <div className="asset-page">
        <HeaderBar text={this.state.assetId} />

        <div className='asset-page-header'>
          <img className="asset-page-image" src={this.state.assetIcon} alt="" />
          <div className="asset-page-asset">{this.state.balance} {this.state.assetId}</div>
          <div className="asset-page-usd">$0.00</div>
        </div>

        <div className='asset-page-title'>Transactions</div>
        <div className='asset-page-filter-container'>
          <div
            className={`asset-page-filter ${this.state.filter === 0 && 'selected'}`}
            onClick={() => this.handleFilterChange(0)}>All
          </div>
          <div
            className={`asset-page-filter ${this.state.filter === 1 && 'selected'}`}
            onClick={() => this.handleFilterChange(1)}>Sent
          </div>
          <div
            className={`asset-page-filter ${this.state.filter === 2 && 'selected'}`}
            onClick={() => this.handleFilterChange(2)}>Received
          </div>
        </div>

        <div className='asset-page-trans'>
          {this.state.txDataToShow && this.state.txDataToShow.map((tx: any, index: number) => (
            <a
              className='home-page-asset-row'
              href={Config.BLOCKCHAIN_SCAN + `${tx.txHashShow}`}
              target="_blank"
              rel="noopener noreferrer"
              key={tx.txHashShow + "-" + index}
            >
              <img className="home-page-asset-icon" src={this.state.assetIcon} alt="" />
              <div
                className="home-page-asset-name">{tx.txType}</div>
              <div>
                <div
                  className="home-page-asset-amount">{tx.valueShow}</div>
                <div className="home-page-asset-usd">{tx.txTimeShow}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

}


export default AssetPage;