import React, { useEffect, useState } from 'react';
import { Select, Form, InputNumber, Button, Space, Modal, Input, message } from 'antd';
import HeaderBar from '../../elements/HeaderBar';
import { useNavigate } from 'react-router-dom';
import '../SimpleTrading/styles.scss';
import { Global } from '../../../server/Global';


const SimpleTradingBot = () => {
  const navigate = useNavigate();
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
  useEffect(() => {
    const getPrice = async () => {
      const price = await Global.account.getGasPrice();
      console.log(price);
      if (price) {
        form.setFieldsValue({ priceCondition: price.toString() });

      }
    }
    getPrice();
  }, []);


  const run = () => {
    Modal.success({
      closable: true,
      title: 'Run successfully!',
      content: 'AA bundlers will run your trading bot to execute your trading strategy, and submit corresponding transactions to trade for you under your authorization',
      footer: (
        <Space style={{ width: '100%', justifyContent: 'end', marginTop: 20 }}>
          <Button>View</Button>
          <Button>Done</Button>
        </Space>
      )
    })
  }

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
    navigate('/spotGridStrategy');
  }

  return (
    <div className="ww-page-container spot-grid-page">
      <HeaderBar text='Simple Trading Bot' />
      <Form
        initialValues={{ asset: 'SWT', gasAsset: "USWT" }}
        onFinish={onFinish}
        form={form}>
        <div className="bot-page-head">Trading asset</div>
        <Space>
          <Form.Item name="asset" rules={[{ required: true }]} >
            <Select defaultValue="SWT" className="ww-selector" style={{ width: '130%' }}>
              <Select.Option value="SWT">SWT</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="assetAmount" rules={[{ required: true }]} >
            <InputNumber style={{ width: '130%' }} placeholder="Amount" />
          </Form.Item>
        </Space>
        <div className="bot-page-head">Starting condition</div>
        <Space>
          <Form.Item rules={[{ required: true }]} >
            <Select defaultValue="Price" className="ww-selector" style={{ width: '130%' }}>
              <Select.Option value="Price">Price</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priceCondition">
            <Input style={{ width: '130%' }} placeholder="Price" />
          </Form.Item>
        </Space>
        <Space align="baseline" size={0}>
          <div className="bot-page-head">Fluctuation  +-</div>
          <Form.Item name="fluctuation" rules={[{ required: true }]} >
            <InputNumber style={{ width: '150%' }} placeholder="%" />
          </Form.Item>
        </Space>
        <div className="bot-page-head">Gas asset</div>
        <Space>
          <Form.Item name="gasAsset" rules={[{ required: true }]} >
            <Select defaultValue="SWT" className="ww-selector" style={{ width: '130%' }}>
              <Select.Option value="SWT">SWT</Select.Option>
              <Select.Option value="USWT">USWT</Select.Option>
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
        <Form.Item wrapperCol={{ span: 14 }}>
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