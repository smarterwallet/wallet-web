import React from 'react';
import './AssetPage.css';
import HeaderBar from '../elements/HeaderBar';
import {Server} from "../../server/server";
import {ETH, formatTimestamp} from "../util/util";
import {ethers} from "ethers";

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
        this.setState({txDataTo: e.txListTo});
        this.setState({txDataFrom: e.txListFrom});
        this.setState({txData: e.mergedArray});
        this.setState({txDataToShow: e.mergedArray});
      })
      Server.account.balanceOfUSDTPM(Server.account.contractAddress).then((e)=>{
        this.setState({balance:e})
      })
    } else if (assetId === "MATIC") {
      assetIcon = '/icon/matic.png';
      this.getMaticList().then((e) => {
        this.setState({txDataTo: e.txListTo});
        this.setState({txDataFrom: e.txListFrom});
        this.setState({txData: e.mergedArray});
        this.setState({txDataToShow: e.mergedArray});
      })
      Server.account.balanceOfMATIC(Server.account.contractAddress).then((e)=>{
        this.setState({balance:e})
      })
    }

    this.setState({assetId, assetIcon});
  }

  async getMaticList() {
    let txListResponse = await Server.account.getMaticTxList(Server.account.contractAddress);


    let txListFrom: any[] = [];
    let txListTo: any[] = [];

    txListResponse.body["result"].forEach((item: any) => {
      if (item.from.toLowerCase() === Server.account.contractAddress.toLowerCase()) {

        txListFrom.push({
          ...item,
          txType: "Sent",
          valueShow: Server.web3.utils.fromWei(item.value),
          txTimeShow: formatTimestamp(item.timeStamp, true),
          txHashShow: item.hash,
        })
        console.log("txListFrom:",txListFrom);
      } else if (item.to.toLowerCase() === Server.account.contractAddress.toLowerCase()) {
        txListTo.push({
          ...item,
          txType: "Received",
          valueShow: Server.web3.utils.fromWei(item.value),
          txTimeShow: formatTimestamp(item.timeStamp, true),
          txHashShow: item.hash,
        })
        console.log("txListTo:",txListTo);
      }
    })

    let mergedArray = txListFrom.concat(txListTo);
    mergedArray.sort((a: any, b: any) => b.timeStamp - a.timeStamp);

    console.log("mergedArray:",mergedArray);
    return {txListTo, txListFrom, mergedArray}
  }

  async getTokenTxList() {
    let txListFromResponse = await Server.account.getTokenTxListByFromAddr(Server.account.contractAddress);
    let txListFrom = txListFromResponse.body["result"].map((item: any) => {
      return {
        ...item,
        txType: "Sent",
        valueShow: Server.web3.utils.fromWei(ethers.utils.hexlify(item.data)),
        txTimeShow: formatTimestamp(parseInt(item.timeStamp, 16), true),
        txHashShow: item.transactionHash,
      };
    });

    let txListToResponse = await Server.account.getTokenTxListByToAddr(Server.account.contractAddress);
    let txListTo = txListToResponse.body["result"].map((item: any) => {
      return {
        ...item,
        txType: "Received",
        valueShow: Server.web3.utils.fromWei(ethers.utils.hexlify(item.data)),
        txTimeShow: formatTimestamp(parseInt(item.timeStamp, 16), true),
        txHashShow: item.transactionHash,
      };
    });

    let mergedArray = txListFrom.concat(txListTo);
    mergedArray.sort((a: any, b: any) => parseInt(b.timeStamp, 16) - parseInt(a.timeStamp, 16));

    return {txListTo, txListFrom, mergedArray}
  }


  handleFilterChange(filter: number) {
    this.setState({filter}, () => {
      console.log("filter: ", filter);
      if (filter === 0) {
        this.setState({txDataToShow: this.state.txData});
      } else if (filter === 1) {
        this.setState({txDataToShow: this.state.txDataFrom});
      } else {
        this.setState({txDataToShow: this.state.txDataTo});
      }
    });
  }

  render() {
    return (
        <div className="asset-page">
          <HeaderBar text={this.state.assetId}/>

          <div className='asset-page-header'>
            <img className="asset-page-image" src={this.state.assetIcon}/>
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
                    href={`https://mumbai.polygonscan.com/tx/${tx.txHashShow}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={tx.txHashShow + "-" + index}
                >
                  <img className="home-page-asset-icon" src={this.state.assetIcon}/>
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