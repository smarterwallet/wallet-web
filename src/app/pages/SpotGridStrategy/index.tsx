import React, { useState } from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { Select, Radio, Form, InputNumber, Button, Space, message } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import '../SpotGrid/styles.scss';
import { Global } from '../../../server/Global';
import { Config } from '../../../server/config/Config';
import { BigNumber, ethers } from 'ethers';
import { JSONBigInt } from '../../../server/js/common_utils';
import { TxUtils } from '../../../server/utils/TxUtils';

const SpotGridStrategy = () => {
  const [to, setTo] = useState("falls to");
  const [by, setBy] = useState("falls by");
  const [buyin, setBuyin] = useState("Buy in")
  const [yieldresult, setYieldresult] = useState("8%~5%");
  const [lossresult, setLossresult] = useState("2%~4%");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onTosell = () => {
    setTo("rises to");
    setBy("rises by");
    setBuyin("Sell out");
    setYieldresult("8%~7%");
    setLossresult("1%~3%");
  }

  const onTobuy = () => {
    setTo("falls to");
    setBy("falls by");
    setBuyin("Buy in");
    setYieldresult("8%~5%");
    setLossresult("2%~4%");
  }

  const save = async () => {
    const autoTradingContractAddress = Config.ADDRESS_AUTO_TRADING;
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Approve tokenA...',
      duration: 0
    });
    const price = await Global.account.getGasPrice();
    // aprove USWT
    const approveERC20TokenA = await Global.account.sendTxApproveERC20Token(
      Config.TOKENS["USWT"].address, autoTradingContractAddress,
      BigNumber.from(10000), Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, price);
    console.log("approveERC20TokenA:", approveERC20TokenA);
    let approveTokenAHash = await Global.account.getUserOperationByHash(approveERC20TokenA["body"]["result"]);
    while (approveTokenAHash.body.result === undefined) {
      approveTokenAHash = await Global.account.getUserOperationByHash(approveERC20TokenA["body"]["result"]);
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Check approve tokenA transaction...',
      duration: 0
    });
    // check transaction status
    await TxUtils.waitForTransactionUntilOnChain(Global.account.ethersProvider, approveTokenAHash["body"]["result"]["transactionHash"]);
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Approve tokenB...',
      duration: 0
    });
    // aprove SWT
    const approveERC20TokenB = await Global.account.sendTxApproveERC20Token(
      Config.TOKENS["SWT"].address, autoTradingContractAddress,
      BigNumber.from(10000), Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, price);
    console.log("approveERC20TokenB:", approveERC20TokenB);
    let approveTokenBHash = await Global.account.getUserOperationByHash(approveERC20TokenB["body"]["result"]);
    while (approveTokenBHash.body.result === undefined) {
      approveTokenBHash = await Global.account.getUserOperationByHash(approveERC20TokenB["body"]["result"]);
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Check approve tokenB transaction...',
      duration: 0
    });
    // check transaction status
    await TxUtils.waitForTransactionUntilOnChain(Global.account.ethersProvider, approveTokenBHash["body"]["result"]["transactionHash"]);
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Add strategy...',
      duration: 0
    });
    // add tx
    // function addStrategy(address tokenFrom, address tokenTo, uint256 tokenFromNum, uint256 tokenToNum, uint256 tokenToNumDIffThreshold)
    const addStrategy = await Global.account.sendTxAddStrategy(
      autoTradingContractAddress,
      [Config.TOKENS["SWT"].address, Config.TOKENS["USWT"].address, 10000, 3000, 100],
      Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, price);
    console.log("addStrategy:", addStrategy);
    let addStrategyHash = await Global.account.getUserOperationReceipt(addStrategy["body"]["result"]);
    while (addStrategyHash.body.result === undefined) {
      addStrategyHash = await Global.account.getUserOperationReceipt(addStrategy["body"]["result"]);
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Check add strategy transaction...',
      duration: 0
    });
    // check transaction status
    await TxUtils.waitForTransactionUntilOnChain(Global.account.ethersProvider, addStrategyHash["body"]["result"]["receipt"]["transactionHash"]);
    const strategyId = parseInt(addStrategyHash["body"]["result"]["receipt"]["logs"][0]["topics"][2], 16);
    console.log("strategyId:", strategyId);
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Sign trategy transaction...',
      duration: 0
    });
    // sign tx
    // function execSwap(uint256 strategyId, address tokenFrom, address tokenTo, uint256 tokenFromNum, uint256 tokenToNum, uint256 tokenToNumDIffThreshold)
    const signTx = await Global.account.signTxTradingStrategy(
      autoTradingContractAddress,
      [strategyId, Config.TOKENS["SWT"].address, Config.TOKENS["USWT"].address, 10000, 3000, 100],
      Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, price);
    console.log("signTx:", [signTx, Config.ADDRESS_ENTRYPOINT]);
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Save strage...',
      duration: 0
    });
    // TODO save to backend
    messageApi.success({
      key: "success",
      content: 'Save strage success',
      duration: 2,
    });
  }

  if (!Global.account.isLoggedIn) {
    message.error("Please sign in first");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="ww-page-container spot-grid-page">
      <HeaderBar text='Spot Grid Strategy' />
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item wrapperCol={{ span: 20 }}>
          <div className="sg-price-wrap">
            {contextHolder}
            <Select
              defaultValue={'ETH'}
              style={{ width: 120 }}
              options={[
                { value: 'ETH', label: 'ETH' },
                { value: 'Matic', label: 'Matic' },
              ]}
            />
            <div className="sg-price">$30000</div>
            <div className="sg-price-changes">+3.02%</div>
          </div>
        </Form.Item>
        <Form.Item className="radio-button">
          <Radio.Group
            defaultValue="1"
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="1" onClick={onTobuy}>Buy at low</Radio.Button>
            <Radio.Button value="2" onClick={onTosell}>Sell at high</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <h3>When the price</h3>
        <Space>
          <Form.Item label={by}>
            <InputNumber style={{ width: '167%' }} placeholder="%" />
          </Form.Item>
          <Form.Item label="or" colon={false}>
          </Form.Item>
        </Space>
        <Form.Item label={to}>
          <InputNumber style={{ width: '100%' }} placeholder="USD" />
        </Form.Item>
        <h3>{buyin}</h3>
        <Space>
          <Form.Item label="proportion">
            <InputNumber style={{ width: '167%' }} placeholder="%" />
          </Form.Item>
          <Form.Item label="or" colon={false}>
          </Form.Item>
        </Space>
        <Form.Item label="quantity">
          <InputNumber style={{ width: '100%' }} placeholder="ETH" />
        </Form.Item>
        <h3>Estimated result</h3>
        <Form.Item wrapperCol={{ span: 14 }}>
          <div className="sg-price-wrap">
            <div className="sg-yield-label">Yield:</div>
            <div className="sg-yield">{yieldresult}</div>
            <div className="sg-yield-label">Loss:</div>
            <div className="sg-yield">{lossresult}</div>
          </div>
        </Form.Item>
        <Space style={{ width: '100%', justifyContent: 'center' }} size={80}>
          <Button shape="round" onClick={save}>Save</Button>
          <Button shape="round" onClick={() => { navigate('/SpotGridBot') }}>Create+</Button>
        </Space>
      </Form>
    </div>
  );
};

export default SpotGridStrategy;

function save() {
  throw new Error('Function not implemented.');
}
