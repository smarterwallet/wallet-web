import React, { useEffect, useState } from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { Select, Radio, Form, InputNumber, Button, Space, message } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import '../SimpleTrading/styles.scss';
import { Global } from '../../../server/Global';
import { Config } from '../../../server/config/Config';
import { BigNumber, ethers } from 'ethers';
import { TxUtils, sleep } from '../../../server/utils/TxUtils';
import { HttpUtils } from '../../../server/utils/HttpUtils';

const SimpleTradingStrategy = () => {
  const [to, setTo] = useState('falls to');
  const [by, setBy] = useState('falls by');
  const [buyin, setBuyin] = useState('Buy in');
  const [yieldresult, setYieldresult] = useState('8%~5%');
  const [lossresult, setLossresult] = useState('2%~4%');
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('SWT');
  const [selectedRadio, setSelectedRadio] = useState<string>('1');
  const [form] = Form.useForm(); // 创建表单实例
  const [botParams, setBotParams] = useState(null);
  const maxUint256 = ethers.BigNumber.from(2).pow(256).sub(1);

  const onTosell = () => {
    setTo('rises to');
    setBy('rises by');
    setBuyin('Sell out');
    setYieldresult('8%~7%');
    setLossresult('1%~3%');
  };

  const onTobuy = () => {
    setTo('falls to');
    setBy('falls by');
    setBuyin('Buy in');
    setYieldresult('8%~5%');
    setLossresult('2%~4%');
  };

  const save = async () => {
    form.submit();
  };

  const getSimpleTradingBotConfig = () => {
    let key = 'spot_grid_bot';
    const str = localStorage.getItem(key);
    return JSON.parse(str);
  };

  /**
   * swap from token
   */
  const getTokenFrom = () => {
    // for buy, swap from USWT to SWT
    if (selectedRadio === '1') {
      return Config.TOKENS['USWT'];
    }
    return Config.TOKENS['SWT'];
  };

  /**
   * swap from token amount
   */
  const getTokenFromAmount = () => {
    // for buy, swap from amount = fallsToPrice * BuyInQuantity
    if (selectedRadio === '1') {
      const fallsToPrice = form.getFieldValue('fallsTo').toString();
      const buyInQuantity = Number(form.getFieldValue('buyInQuantity'));
      let decimalFactor;
      let decimalAsInteger;
      if (fallsToPrice.includes('.')) {
        decimalFactor = ethers.BigNumber.from('10').pow(fallsToPrice.split('.')[1].length);
        decimalAsInteger = ethers.BigNumber.from(fallsToPrice.replace('.', ''));
      } else {
        decimalFactor = 1;
        decimalAsInteger = ethers.BigNumber.from(fallsToPrice);
      }
      let result = decimalAsInteger.mul(buyInQuantity).div(decimalFactor);
      return BigNumber.from(result.toBigInt().toString());
    }
    // for sell, swap from amount = tradingAssetAmount
    return BigNumber.from(getSimpleTradingBotConfig().assetAmount);
  };

  /**
   * swap to token
   */
  const getTokenTo = () => {
    // for buy, swap from USWT to SWT
    if (selectedRadio === '1') {
      return Config.TOKENS['SWT'];
    }
    return Config.TOKENS['USWT'];
  };

  /**
   * swap to token amount
   */
  const getTokenToAmount = () => {
    // for buy, swap to amount = BuyInQuantity
    if (selectedRadio === '1') {
      return BigNumber.from(form.getFieldValue('buyInQuantity'));
    }
    // for sell, swap to amount = sellOutQuantity
    return BigNumber.from(form.getFieldValue('sellOutQuantity'));
  };

  const getTokenToNumDIffThreshold = () => {
    if (selectedRadio === '1') {
      return BigNumber.from(form.getFieldValue('buy-fluctuation'));
    }
    return BigNumber.from(form.getFieldValue('sell-fluctuation'));
  };

  const createStrategy = async () => {
    const tokenFrom = getTokenFrom();
    const tokenTo = getTokenTo();
    const tokenFromAmount = getTokenFromAmount();
    const tokenToAmount = getTokenToAmount();
    const tokenToNumDIffThreshold = getTokenToNumDIffThreshold();
    const priceCondition = BigNumber.from(getSimpleTradingBotConfig().priceCondition * 1e18 + '');
    console.log('tokenFrom:', tokenFrom);
    console.log('tokenTo:', tokenTo);
    console.log('tokenFromAmount:', tokenFromAmount);
    console.log('tokenToAmount:', tokenToAmount);
    console.log('tokenToNumDIffThreshold:', tokenToNumDIffThreshold);

    const autoTradingContractAddress = Config.ADDRESS_AUTO_TRADING;
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Approve tokenFrom...',
      duration: 0,
    });
    let gasPrice = await Global.account.getGasPrice();
    // approve tokenFrom
    const approveERC20TokenA = await Global.account.sendTxApproveERC20Token(
      tokenFrom.address,
      autoTradingContractAddress,
      maxUint256,
      Config.ADDRESS_TOKEN_PAYMASTER,
      Config.ADDRESS_ENTRYPOINT,
      gasPrice,
    );
    console.log('approveERC20TokenFrom:', approveERC20TokenA);
    let approveTokenAHash = await Global.account.getUserOperationByHash(approveERC20TokenA['body']['result']);
    while (approveTokenAHash.body.result === undefined) {
      approveTokenAHash = await Global.account.getUserOperationByHash(approveERC20TokenA['body']['result']);
      await sleep(5000);
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Check approve tokenFrom transaction...',
      duration: 0,
    });
    // check transaction status
    await TxUtils.waitForTransactionUntilOnChain(
      Global.account.ethersProvider,
      approveTokenAHash['body']['result']['transactionHash'],
    );
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Approve tokenTo...',
      duration: 0,
    });
    // approve tokenTo
    // const approveERC20TokenB = await Global.account.sendTxApproveERC20Token(
    //   tokenTo.address, autoTradingContractAddress,
    //   maxUint256, Config.ADDRESS_TOKEN_PAYMASTER, Config.ADDRESS_ENTRYPOINT, gasPrice);
    // console.log("approveERC20TokenTo:", approveERC20TokenB);
    // let approveTokenBHash = await Global.account.getUserOperationByHash(approveERC20TokenB["body"]["result"]);
    // while (approveTokenBHash.body.result === undefined) {
    //   approveTokenBHash = await Global.account.getUserOperationByHash(approveERC20TokenB["body"]["result"]);
    //   await sleep(5000)
    // }
    // messageApi.loading({
    //   key: Global.messageTypeKeyLoading,
    //   content: 'Check approve tokenTo transaction...',
    //   duration: 0
    // });
    // check transaction status
    // await TxUtils.waitForTransactionUntilOnChain(Global.account.ethersProvider, approveTokenBHash["body"]["result"]["transactionHash"]);
    // add tx
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Add strategy...',
      duration: 0,
    });
    // function addStrategy(address tokenFrom, address tokenTo, uint256 tokenFromNum, uint256 tokenToNum, uint256 tokenToNumDIffThreshold)
    const addStrategy = await Global.account.sendTxAddStrategy(
      autoTradingContractAddress,
      [tokenFrom.address, tokenTo.address, tokenFromAmount, tokenToAmount, tokenToNumDIffThreshold],
      Config.ADDRESS_TOKEN_PAYMASTER,
      Config.ADDRESS_ENTRYPOINT,
      gasPrice,
    );
    console.log('addStrategy:', addStrategy);
    let addStrategyHash = await Global.account.getUserOperationReceipt(addStrategy['body']['result']);
    while (addStrategyHash.body.result === undefined) {
      addStrategyHash = await Global.account.getUserOperationReceipt(addStrategy['body']['result']);
      await sleep(5000);
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Check add strategy transaction...',
      duration: 0,
    });
    // check transaction status
    await TxUtils.waitForTransactionUntilOnChain(
      Global.account.ethersProvider,
      addStrategyHash['body']['result']['receipt']['transactionHash'],
    );
    const strategyId = parseInt(addStrategyHash['body']['result']['receipt']['logs'][0]['topics'][2], 16);
    console.log('addStrategyHash', addStrategyHash);

    console.log('strategyId:', strategyId);
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Sign trategy transaction...',
      duration: 0,
    });
    // sign tx
    // function execSwap(uint256 strategyId, address tokenFrom, address tokenTo, uint256 tokenFromNum, uint256 tokenToNum, uint256 tokenToNumDIffThreshold)
    const signTx = await Global.account.signTxTradingStrategy(
      autoTradingContractAddress,
      [strategyId, tokenFrom.address, tokenTo.address, tokenFromAmount, tokenToAmount, tokenToNumDIffThreshold],
      Config.ADDRESS_TOKEN_PAYMASTER,
      Config.ADDRESS_ENTRYPOINT,
      gasPrice,
    );
    console.log('signTx:', [signTx, Config.ADDRESS_ENTRYPOINT]);
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Save Strategy...',
      duration: 0,
    });
    const stargeParams = {
      owner_address: Global.account.contractWalletAddress,
      token_from: tokenFrom.address,
      token_from_num: tokenFromAmount.toString(),
      token_to: tokenTo.address,
      token_to_num: tokenToAmount.toString(),
      token_to_num_fluctuation: tokenToNumDIffThreshold.toString(),
      start_condition_price: priceCondition.toString(),
      user_operation: signTx,
    };
    const saveStarge = await HttpUtils.post(Config.AUTO_TRADING_API + '/api/v1/strategy/simple', stargeParams);
    if (saveStarge.body['code'] != 200) {
      messageApi.error({
        key: Global.messageTypeKeyLoading,
        content: 'Save starage to bundler error. Please retry. Error details: ' + saveStarge.body['message'],
        duration: 0,
      });
    } else {
      messageApi.success({
        key: Global.messageTypeKeyLoading,
        content: 'Create Strategy success',
        duration: 0,
      });
    }
  };

  let priceUrl =
    Config.AUTO_TRADING_API +
    '/api/v1/price/current/simple/0x4B63443E5eeecE233AADEC1359254c5C601fB7f4/0xF981Ac497A0fe7ad2Dd670185c6e7D511Bf36d6d';
  useEffect(() => {
    fetch(priceUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let ethValue = ethers.utils.formatEther(data.result + '');
        const price = parseFloat(parseFloat(ethValue).toFixed(4));
        setEthPrice(price);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [selectedCurrency]);

  useEffect(() => {
    //刷新页面表单内容恢复为用户点击save时的表单状态
    const savedConfig = localStorage.getItem('Config detail');
    if (savedConfig) {
      form.setFieldsValue(JSON.parse(savedConfig));
    }
    let key = 'spot_grid_bot';
    const str = localStorage.getItem(key);
    let items = JSON.parse(str);
    console.log(items);
    setBotParams(items);
  }, []);

  const saveConfig = (values: any) => {
    localStorage.setItem('Config detail', JSON.stringify(values));
    message.success({
      key: Global.messageTypeKeyLoading,
      content: 'Save Strategy success',
      duration: 1,
    });
  };

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
  };

  const handleRadioChange = (e: any) => {
    setSelectedRadio(e.target.value);
  };

  if (!Global.account.isLoggedIn) {
    message.error('Please login first');
    return <Navigate to="/" replace />;
  }

  return (
    <div className="ww-page-container spot-grid-page">
      <HeaderBar text="Spot Grid Strategy" />
      <Form
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        form={form}
        onFinish={saveConfig}
      >
        <Form.Item wrapperCol={{ span: 20 }}>
          <div className="sg-price-wrap">
            {contextHolder}
            <Select
              defaultValue={'SWT'}
              style={{ width: 180, height: 60 }}
              options={[{ value: 'SWT', label: 'SWT' }]}
              onChange={handleCurrencyChange}
            />
            <div className="sg-price">{ethPrice} USWT</div>
            <div className="sg-price-changes"></div>
          </div>
        </Form.Item>
        <Form.Item className="radio-button">
          <Radio.Group defaultValue="1" optionType="button" buttonStyle="solid" onChange={handleRadioChange}>
            <Radio.Button value="1" onClick={onTobuy}>
              Buy at low
            </Radio.Button>
            <Radio.Button value="2" onClick={onTosell}>
              Sell at high
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        {selectedRadio === '1' && (
          <div id="buy">
            <h3>When the price</h3>
            <Space size={8}>
              <Form.Item label={by} name="fallsBy">
                <InputNumber style={{ width: '100%' }} placeholder="%" />
              </Form.Item>
              <div className="text-suffix">OR</div>
            </Space>

            <Form.Item label={to} name="fallsTo">
              <InputNumber style={{ width: '100%' }} placeholder="USD" />
            </Form.Item>
            <Form.Item label="fluctuation+-" name="buy-fluctuation">
              <InputNumber style={{ width: '100%' }} placeholder="%" />
            </Form.Item>

            <h3>{buyin}</h3>
            <Space>
              <Form.Item label="quantity" name="buyInQuantity">
                <InputNumber style={{ width: '100%' }} placeholder="SWT" />
              </Form.Item>
              <div className="text-suffix">OR</div>
            </Space>
            <Form.Item label="proportion" name="buyInProportion">
              <InputNumber style={{ width: '100%' }} placeholder="%" />
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
          </div>
        )}

        {selectedRadio === '2' && (
          <div id="sell">
            <h3>When the price</h3>
            <Space>
              <Form.Item label={by} name="riseBy">
                <InputNumber style={{ width: '100%' }} placeholder="%" />
              </Form.Item>
              <div className="text-suffix">OR</div>
            </Space>
            <Form.Item label={to} name="riseTo">
              <InputNumber style={{ width: '100%' }} placeholder="USD" />
            </Form.Item>
            <Form.Item label="fluctuation+-" name="sell-fluctuation">
              <InputNumber style={{ width: '100%' }} placeholder="%" />
            </Form.Item>

            <h3>{buyin}</h3>
            <Space>
              <Form.Item label="quantity" name="sellOutQuantity">
                <InputNumber style={{ width: '100%' }} placeholder="ETH" />
              </Form.Item>
              <div className="text-suffix">OR</div>
            </Space>
            <Form.Item label="proportion" name="sellOutProportion">
              <InputNumber style={{ width: '100%' }} placeholder="%" />
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
          </div>
        )}

        <Space style={{ width: '100%', justifyContent: 'center' }} size={80}>
          <Button shape="round" onClick={save}>
            Save
          </Button>
          <Button shape="round" onClick={createStrategy}>
            Create+
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default SimpleTradingStrategy;
