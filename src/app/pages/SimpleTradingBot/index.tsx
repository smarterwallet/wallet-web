import React, { useEffect, useState } from 'react';
import { Select, Form, InputNumber, Button, Space, Modal, Input, message } from 'antd';
import HeaderBar from '../../elements/HeaderBar';
import { useLocation, useNavigate } from 'react-router-dom';
import '../SimpleTrading/styles.scss';
import { Global } from '../../../server/Global';
import { ethers } from 'ethers';
import { Config } from '../../../server/config/Config';


const SimpleTradingBot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //
  console.log(location.state);
  const [messageApi, contextHolder] = message.useMessage();

  interface Props {
    src1: string; text1: string; text2: string, text3: string;
  }

  const Iconandtext = ({ src1, text1, text2, text3 }: Props) => {
    return (
      <div className="bot-page-app-row" >
        <img className="bot-page-app-icon" src={src1} />
        <div className="bot-page-app-name">{text1}</div>
        <div className="bot-page-app-name-bold">{text2}</div>
        <div className="bot-page-app-name-bold">{text3}</div>
      </div>
    );
  };
  let priceUrl = Config.AUTO_TRADING_API + "/api/v1/price/current/simple/0x4B63443E5eeecE233AADEC1359254c5C601fB7f4/0xF981Ac497A0fe7ad2Dd670185c6e7D511Bf36d6d"
  useEffect(() => {
    fetch(priceUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let ethValue = ethers.utils.formatEther(data.result + "");
        const price = parseFloat(parseFloat(ethValue).toFixed(4))
        form.setFieldsValue({ priceCondition: price.toString() });
      })
      .catch(error => {
        console.error("Error:", error);
      });
      //刷新页面表单内容恢复为用户上次设置的网格机器人状态
    const grid_bot = localStorage.getItem('spot_grid_bot');
    if (grid_bot) {
      form.setFieldsValue(JSON.parse(grid_bot));
    }
  }, []);

  const [form] = Form.useForm(); // 创建表单实例

  const saveAndNext = async () => {
    form.submit();
  }

  const onFinish = async (values: any) => {
    const assetValue = form.getFieldValue('asset');
    console.log(assetValue); // 输出asset字段的值
    console.log("Form values:", values);
    let key = "spot_grid_bot";
    if (values.assetAmount == undefined || values.assetAmount < 0.001) {
      console.log("Invalid asset amount:", values.assetAmount);
      return;
    }
    localStorage.setItem(key, JSON.stringify(values));
    navigate('/simpleStrategy');
  }

  return (
    <div className="ww-page-container spot-grid-page">
      <HeaderBar text='Simple Trading Bot' />
      <Form
        initialValues={{ asset: 'SWT', gasAsset: "USWT" }}
        onFinish={onFinish}
        form={form}>
        <div className="bot-page-head ">Trading asset</div>
        <Space>
          <Form.Item name="asset" rules={[{ required: true }]} >
            <Select defaultValue="SWT" className="ww-selector" style={{ width: '130%' }}>
              <Select.Option className="input-number select-option-text" value="SWT">SWT</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="assetAmount" rules={[{ required: true }]} >
            <InputNumber className="input-number ant-input css-dev-only-do-not-override-1tudys6" placeholder="Amount" />
          </Form.Item>
        </Space>
        <div className="bot-page-head">Starting condition</div>
        <Space>
          <Form.Item rules={[{ required: true }]} >
            <Select defaultValue="Price" className="ww-selector input-number">
              <Select.Option value="Price">Price</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priceCondition">
            <InputNumber className="input-number ant-input css-dev-only-do-not-override-1tudys6" placeholder="USDT" />
          </Form.Item>
        </Space>
        <Space align="baseline" size={0}>
          <div className="bot-page-head">Fluctuation</div>
          <Form.Item name="fluctuation" rules={[{ required: true }]} style={{ width: '100%' }}>
            <InputNumber className="ant-input css-dev-only-do-not-override-1tudys6" placeholder="%" />
          </Form.Item>
        </Space>
        <div className="bot-page-head">Gas asset</div>
        <Space>
          <Form.Item name="gasAsset" rules={[{ required: true }]} >
            <Select defaultValue="SWT" className="ww-selector input-number">
              <Select.Option value="SWT">SWT</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item >
            <Input style={{ width: '130%' }} defaultValue="0.05" />
          </Form.Item>
        </Space>
        <div className="bot-page-head">Operation DApps</div>
        <div className="bot-page-app-container">
          <Iconandtext src1={"/icon/defi.png"} text1={"Swap via"} text2={"Uniswap"} text3={"(Polygon)"} />
          <Iconandtext src1={"/icon/login.png"} text1={" "} text2={" "} text3={" "} />
          <Iconandtext src1={"/icon/defi.png"} text1={"Buy ETH"} text2={"via Aave"} text3={"(Ethereum)"} />
          <Iconandtext src1={"/icon/add.png"} text1={" "} text2={" "} text3={" "} />
          <Iconandtext src1={"/icon/defi.png"} text1={"Sell ETH"} text2={"via Aave"} text3={"(Ethereum)"} />
          <Iconandtext src1={"/icon/login.png"} text1={" "} text2={" "} text3={" "} />
          <Iconandtext src1={"/icon/defi.png"} text1={"Swap via"} text2={"Uniswap"} text3={"(Polygon)"} />
        </div>
        <div className="bot-page-head">Estimated result</div>
        <Form.Item wrapperCol={{ span: 16 }}>
          <div className="sg-price-wrap">
            <div className="sg-yield-label">Estimated Yield:</div>
            <div className="sg-yield">$400~$200</div>
          </div>
          <div className="sg-price-wrap">
            <div className="sg-yield-label">Estimated Loss:</div>
            <div className="sg-yield">$40~$80</div>
          </div>
        </Form.Item>

        <div className="ww-tc">
          <Button shape="round" onClick={saveAndNext} style={{ width: '100%' }}>Next</Button>
        </div>
      </Form>
    </div>
  );
};

export default SimpleTradingBot;