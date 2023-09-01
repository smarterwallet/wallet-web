import React, { useState } from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { Select, Radio, Form, InputNumber, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../SpotGrid/styles.scss';
import RadioInput from '../../component/RadioInput';

const Index = () => {
  const [to, setTo] = useState("falls to");
  const [by, setBy] = useState("falls by");
  const [buyin, setBuyin] = useState("Buy in")
  const [yieldresult, setYieldresult] = useState("8%~5%");
  const [lossresult, setLossresult] = useState("2%~4%");
  const navigate = useNavigate();

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

  return (
    <div className="ww-page-container spot-grid-page">
      <HeaderBar text='Spot Grid Strategy'/>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item wrapperCol={{ span: 20 }}>
          <div className="sg-price-wrap">
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
            <InputNumber style={{ width: '167%' }} placeholder="%"/>
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
            <InputNumber style={{ width: '167%' }} placeholder="%"/>
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
          <Button shape="round" onClick={() => { message.success('Saved successfully') }}>Save</Button>
          <Button shape="round" onClick={() => { navigate('/SpotGridBot') }}>Create+</Button>
        </Space>
      </Form>
    </div>
  );
};

export default Index;