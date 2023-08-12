import React from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { Select, Radio, Form, InputNumber, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="ww-page-container">
      <HeaderBar text='Spot Grid Strategy'/>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item wrapperCol={{ span: 24 }}>
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
        <Form.Item>
          <Radio.Group
            defaultValue="1"
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="1">Buy at low</Radio.Button>
            <Radio.Button value="2">Sell at high</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <h3>Grid Range</h3>
        <Form.Item label="From">
          <InputNumber style={{ width: '100%' }} placeholder="USD"/>
        </Form.Item>
        <Form.Item label="To">
          <InputNumber style={{ width: '100%' }} placeholder="USD" />
        </Form.Item>
        <h3>Grid Mode</h3>
        <Form.Item>
          <Radio.Group
            defaultValue="1"
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="1">Arithmetic</Radio.Button>
            <Radio.Button value="2">Geometric</Radio.Button>
            <Radio.Button value="3">Quantity</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <div className={'ww-tc'} style={{ marginTop: 40 }}>
          <Button
            type="primary"
            onClick={() => { navigate('/SpotGridBot') }}
            shape="round"
          >Create a Bot to Run</Button>
        </div>
      </Form>
    </div>
  );
};

export default Index;