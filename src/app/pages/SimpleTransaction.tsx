import React from 'react';
import './LoginPage.css';
import HeaderBar from '../elements/HeaderBar';
import {Server} from '../../server/server';
import AlertModal from '../modals/AlertModal';
import {BigNumber} from "ethers";
import {Config} from "../../server/config";
import {Navigate} from "react-router-dom";

const polygonConfig = require('../config/polygon.json');
const polygonMumbaiConfig = require('../config/polygon-mumbai.json');

interface SimpleTransactionState {
    txTo: string;
    txValue: string;
    gasPrice: BigNumber;
    alert: string;
    selectedAsset: string;
}

class SimpleTransactionPage extends React.Component<{}, SimpleTransactionState> {

    constructor(props: any) {
        super(props);
        Server.account.getGasPrice().then(
            (e) => this.setState({gasPrice: e})
        );
        this.state = {
            txTo: '',
            txValue: '',
            gasPrice: BigNumber.from(0),
            alert: '',
            selectedAsset: 'Matic'
        }

        this.onToChange = this.onToChange.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onAssetChange = this.onAssetChange.bind(this);
        this.onGasFeeChange = this.onGasFeeChange.bind(this);

        this.flushConfig("Mumbai");
    }

    onToChange(e: any) {
        this.setState({txTo: e.currentTarget.value});
    };

    onValueChange(e: any) {
        this.setState({txValue: e.currentTarget.value});
    };

    onGasFeeChange(e: any) {
        this.setState({gasPrice: e.currentTarget.value});
    };

    onAssetChange(e: any) {
        this.setState({selectedAsset: e.currentTarget.value});
    };

    componentDidMount(): void {
    }

    async onSend() {
        if (this.state.selectedAsset.trim() === '' || this.state.gasPrice.toBigInt() <= 0 || this.state.txTo.trim() === '' || this.state.txValue.trim() === '') {
            this.setState({alert: 'Params can not be empty or zero.'});
            return;
        }

        this.setState({alert: this.state.selectedAsset + " sending..."});
        try {
            if (this.state.selectedAsset == "Matic") {
                await Server.account.sendMainToken(this.state.txValue, this.state.txTo, Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, this.state.gasPrice);
            } else if (this.state.selectedAsset == "SWT") {
                await Server.account.sendERC20Token(Config.TOKENS[this.state.selectedAsset].address, this.state.txValue, this.state.txTo, Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, this.state.gasPrice)
            } else if (this.state.selectedAsset == "USDC") {
                // TODO USDC need approve on chain first
                await Server.account.sendERC20Token(Config.TOKENS[this.state.selectedAsset].address, this.state.txValue, this.state.txTo, Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, this.state.gasPrice)
            } else {
                this.setState({alert: "unknown asset: " + this.state.selectedAsset});
            }
        } catch (error) {
            this.setState({alert: "Error: " + error});
            return;
        }
        this.setState({alert: "send " + this.state.selectedAsset + " success"});
    }

    async flushConfig(chainName: string) {
        console.log("start to flush. Chain name: " + chainName);
        switch (chainName) {
            case "Polygon":
                await Config.flushConfig(JSON.stringify(polygonConfig));
                break;
            case "Mumbai":
                await Config.flushConfig(JSON.stringify(polygonMumbaiConfig));
                break;
        }
    }

    render() {
        if (!Server.account.isLoggedIn()) {
            return <Navigate to="/" replace/>;
        }

        return (
            <div className="login-page">
                <HeaderBar text='Send Transaction'/>
                <br/>
                <div>Chain</div>
                <select onChange={event => this.flushConfig(event.target.value)}>
                    <option value="Mumbai">Mumbai</option>
                    {/*<option value="Polygon">Polygon</option>*/}
                </select>
                <br/>
                <div>Asset</div>
                <select value={this.state.selectedAsset} onChange={this.onAssetChange}>
                    <option value="Matic">Matic</option>
                    <option value="SWT">SWT</option>
                    {/*<option value="USDC">USDC</option>*/}
                </select>
                <br/>
                <div>Send To</div>
                <input type="string" value={this.state.txTo} onChange={this.onToChange}/>
                <br/>
                <div>Amount</div>
                <input type="string" value={this.state.txValue} onChange={this.onValueChange}/>
                <br/>
                <div>Gas Price(Wei)</div>
                <input type="string" value={this.state.gasPrice.toString()} onChange={this.onGasFeeChange}/>
                <br/><br/>
                <button className='simple-transaction-page-button' onClick={async () => await this.onSend()}>Send
                </button>

                <AlertModal message={this.state.alert} button={null} onClose={() => this.setState({alert: ''})}/>
            </div>
        );
    }
}

export default SimpleTransactionPage;