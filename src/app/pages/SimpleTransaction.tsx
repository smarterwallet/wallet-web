import React from 'react';
import './Login/LoginPage.css';
import HeaderBar from '../elements/HeaderBar';
import { Global } from '../../server/Global';
import { BigNumber } from "ethers";
import { Config } from "../../server/config/Config";
import { Navigate } from "react-router-dom";
import { message } from 'antd';

const polygonConfig = require('../config/polygon.json');
const polygonMumbaiConfig = require('../config/mumbai.json');

interface SimpleTransactionState {
    txTo: string;
    txValue: string;
    gasPrice: string;
    alert: string;
    selectedAsset: string;
}

class SimpleTransactionPage extends React.Component<{}, SimpleTransactionState> {

    constructor(props: any) {
        super(props);
        this.state = {
            txTo: '',
            txValue: '',
            gasPrice: '0',
            alert: '',
            selectedAsset: 'Matic'
        }

        this.onToChange = this.onToChange.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onAssetChange = this.onAssetChange.bind(this);
        this.onGasFeeChange = this.onGasFeeChange.bind(this);

        this.flushConfig(Config.DEFAULT_NETWORK);
    }

    onToChange(e: any) {
        this.setState({ txTo: e.currentTarget.value });
    };

    onValueChange(e: any) {
        this.setState({ txValue: e.currentTarget.value });
    };

    onGasFeeChange(e: any) {
        this.setState({ gasPrice: e.currentTarget.value });
    };

    onAssetChange(e: any) {
        this.setState({ selectedAsset: e.currentTarget.value });
    };

    componentDidMount(): void {
    }

    async onSend() {
        if (this.state.selectedAsset.trim() === '' || this.state.gasPrice.toString() === "0" || this.state.txTo.trim() === '' || this.state.txValue.trim() === '') {
            message.error('Params can not be empty or zero');
            return;
        }

        message.info("Sending " + this.state.selectedAsset);
        try {
            const gasPrice  = BigNumber.from(this.state.gasPrice);
            if (this.state.selectedAsset === "Matic") {
                await Global.account.sendMainToken(this.state.txValue, this.state.txTo, Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, gasPrice);
            } else if (this.state.selectedAsset === "SWT") {
                await Global.account.sendERC20Token(Config.TOKENS[this.state.selectedAsset].address, this.state.txValue, this.state.txTo, Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, gasPrice)
            } else if (this.state.selectedAsset === "USDC") {
                // TODO USDC need approve on chain first
                await Global.account.sendERC20Token(Config.TOKENS[this.state.selectedAsset].address, this.state.txValue, this.state.txTo, Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, gasPrice)
            } else {
                this.setState({ alert: "unknown asset: " + this.state.selectedAsset });
            }
        } catch (error) {
            this.setState({ alert: error.toString() });
            return;
        }
        message.info("Sent " + this.state.selectedAsset + " success");
    }

    async flushConfig(chainName: string) {
        message.info('Init ' + chainName + ' config');
        switch (chainName.toLowerCase()) {
            case "polygon":
                await Config.init(JSON.stringify(polygonConfig));
                break;
            case "mumbai":
                await Config.init(JSON.stringify(polygonMumbaiConfig));
                break;
        }
        const price = await Global.account.getGasPrice();
        this.setState({ gasPrice: price.toString() })
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    render() {
        if (!Global.account.isLoggedIn) {
            return <Navigate to="/" replace />;
        }

        return (
            <div className="login-page">
                <HeaderBar text='Send Transaction' />
                <br />
                <div>Chain:</div>
                <select onChange={async event => await this.flushConfig(event.target.value)}>
                    <option value="Polygon">Polygon</option>
                    <option value="Mumbai">Mumbai</option>
                </select>
                <br />
                <div>Asset:</div>
                <select value={this.state.selectedAsset} onChange={this.onAssetChange}>
                    <option value="Matic">Matic</option>
                    <option value="SWT">SWT</option>
                    {/*<option value="USDC">USDC</option>*/}
                </select>
                <br />
                <div>Send To:</div>
                <input type="string" value={this.state.txTo} onChange={this.onToChange} />
                <br />
                <div>Amount:</div>
                <input type="string" value={this.state.txValue} onChange={this.onValueChange} />
                <br />
                <div>Gas Price(Wei):</div>
                <input type="number" value={this.state.gasPrice} onChange={this.onGasFeeChange} />
                <br /><br />
                <button className='simple-transaction-page-button' onClick={async () => await this.onSend()}>Send
                </button>
            </div>
        );
    }
}

export default SimpleTransactionPage;