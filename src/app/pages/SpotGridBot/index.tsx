import React from 'react';
import { Select, Form, InputNumber, Button, Space, Modal } from 'antd';
import HeaderBar from '../../elements/HeaderBar';
import { useNavigate } from 'react-router-dom';
import '../SpotGrid/styles.scss';


const Index = () => {
  const navigate = useNavigate();

  interface Props {
    src1: string; text1:string; text2:string, text3:string;
  }

  const Iconandtext = ({src1, text1, text2, text3}: Props)=>{
    return (
      <div className="bot-page-app-row" >
        <img className="bot-page-app-icon" src={src1} />
        <div className="bot-page-app-name">{text1}</div>
        <div className="bot-page-app-name-bold">{text2}</div>
        <div className="bot-page-app-name-bold">{text3}</div>
      </div>
    );
  };

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

  return (
    <div className="ww-page-container spot-grid-page">
      <HeaderBar text='Spot Grid Bot'/>
      <Form>
        <div className="bot-page-head">Trading asset</div>
        <Space>
          <Form.Item>
            <Select defaultValue="Type" className="ww-selector" style={{ width: '130%' }}>
              <Select.Option value="Type">Type</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <InputNumber style={{ width: '130%' }} placeholder="Amount"/>
          </Form.Item>
        </Space>
        <div className="bot-page-head">Starting condition</div>
        <Space>
          <Form.Item>
            <Select defaultValue="Price" className="ww-selector" style={{ width: '130%' }}>
              <Select.Option value="Price">Price</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <InputNumber style={{ width: '130%' }} placeholder="Amount"/>
          </Form.Item>
        </Space>
        <Space align="baseline" size={0}>
          <div className="bot-page-head">Fluctuation  +-</div>
          <Form.Item>
            <InputNumber style={{ width: '150%' }} placeholder="USD"/>
          </Form.Item>
        </Space>
        <div className="bot-page-head">Gas asset</div>
        <Space>
          <Form.Item>
            <Select defaultValue="Type" className="ww-selector" style={{ width: '130%' }}>
              <Select.Option value="Type">Type</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <InputNumber style={{ width: '130%' }} placeholder="Amount"/>
          </Form.Item>
        </Space>
        <div className="bot-page-head">Operation DApps</div>
        <div className="bot-page-app-container">
          <Iconandtext src1={"/icon/defi.png"} text1={"Swap via"} text2={"Uniswap"} text3={"(Polygon)"} />
          <Iconandtext src1={"/icon/login.png"} text1={" "} text2={" "} text3={" "}/>
          <Iconandtext src1={"/icon/defi.png"} text1={"Buy ETH"} text2={"via Aave"} text3={"(Ethereum)"}/>
          <Iconandtext src1={"/icon/add.png"} text1={" "} text2={" "} text3={" "}/>
          <Iconandtext src1={"/icon/defi.png"} text1={"Sell ETH"} text2={"via Aave"} text3={"(Ethereum)"}/>
          <Iconandtext src1={"/icon/login.png"} text1={" "} text2={" "} text3={" "}/>
          <Iconandtext src1={"/icon/defi.png"} text1={"Swap via"} text2={"Uniswap"} text3={"(Polygon)"}/>
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
          <Button shape="round" onClick={() => { navigate("/autotradebotok") }} style={{ width: '100%'}}>Run</Button>
        </div>
      </Form>
    </div>
  );
};

export default Index;