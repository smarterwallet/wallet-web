import React, { useEffect, useState } from 'react';
import './Login/LoginPage.css';
import HeaderBar from '../elements/HeaderBar';
import { Global } from '../../server/Global';
import { BigNumber } from "ethers";
import { Config } from "../../server/config/Config";
import { Navigate } from "react-router-dom";
import { message } from 'antd';

const polygonConfig = require('../config/polygon.json');
const polygonMumbaiConfig = require('../config/mumbai.json');


const SimpleTransactionPage = (props: any) => {

  const [txTo, setTxTo] = useState('');
  const [txValue, setTxValue] = useState('');
  const [gasPrice, setGasPrice] = useState('0');
  const [selectedAsset, setSelectedAsset] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const onSendKey = 'onSend';
  const flushConfigKey = 'flushConfig';

  const onSend = async () => {
    if (selectedAsset.trim() === '' || gasPrice.toString() === "0" || txTo.trim() === '' || txValue.trim() === '') {
      message.error('Params can not be empty or zero');
      return;
    }

    messageApi.open({
      key: onSendKey,
      type: 'loading',
      content: "Sending " + selectedAsset,
    });

    try {
      const sendGasPrice  = BigNumber.from(gasPrice);
      if (selectedAsset === "Matic") {
        await Global.account.sendMainToken(txValue, txTo, Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, sendGasPrice);
      } else if (selectedAsset === "SWT") {
        await Global.account.sendERC20Token(Config.TOKENS[selectedAsset].address, txValue, txTo, Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, sendGasPrice)
      } else if (selectedAsset === "USDC") {
        await Global.account.sendERC20Token(Config.TOKENS[selectedAsset].address, txValue, txTo, Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, sendGasPrice)
      } else {
        message.error("unknown asset: " + selectedAsset)
        messageApi.destroy(onSendKey)
      }
    } catch (error) {
      message.error(error.toString())
      messageApi.destroy(onSendKey)
      return;
    }
    messageApi.open({
      key: onSendKey,
      type: 'success',
      content: "Sent " + selectedAsset + " success",
    });
  }

  useEffect(() => {
    flushConfig(Config.DEFAULT_NETWORK)
  }, []);

  const flushConfig = async (chainName: string) => {
    messageApi.open({
      key: flushConfigKey,
      type: 'loading',
      content: 'Init ' + chainName + ' config',
    });
    switch (chainName.toLowerCase()) {
      case "polygon":
        await Config.init(JSON.stringify(polygonConfig));
        break;
      case "mumbai":
        await Config.init(JSON.stringify(polygonMumbaiConfig));
        break;
    }
    await Global.init();
    const price = await Global.account.getGasPrice();
    messageApi.destroy(flushConfigKey);
    setGasPrice(price.toString());
  }

  if (!Global.account.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">
      {contextHolder}
      <HeaderBar text='Send Transaction' />
      <br />
      <div>Chain:</div>
      <select onChange={async event => await flushConfig(event.target.value)} defaultValue={Config.DEFAULT_NETWORK}>
        <option value="Polygon">Polygon</option>
        <option value="Mumbai">Mumbai</option>
      </select>
      <br />
      <div>Asset:</div>
      <select
        value={selectedAsset}
        onChange={(e) => {
          setSelectedAsset(e.currentTarget.value)
        }}
      >
        <option value="Matic" defaultChecked>Matic</option>
        <option value="SWT">SWT</option>
      </select>
      <br />
      <div>Send To:</div>
      <input
        type="string"
        value={txTo}
        onChange={(e) => setTxTo(e.currentTarget.value)}
      />
      <br />
      <div>Amount:</div>
      <input
        type="string"
        value={txValue}
        onChange={(e) => setTxValue(e.currentTarget.value)}
      />
      <br />
      <div>Gas TokenPayer:</div>
      <input
        type="string"
        value={"SWT"}
        disabled
        onChange={(e) => {}}
      />
      <br />
      <div>Gas Price(Wei):</div>
      <input
        type="number"
        value={gasPrice}
        onChange={(e) => setGasPrice(e.currentTarget.value)}
      />
      <br /><br />
      <button
        className='simple-transaction-page-button'
        onClick={() => onSend()}
      >Send</button>
    </div>
  )
};


export default SimpleTransactionPage;