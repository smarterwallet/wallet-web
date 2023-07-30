import React from 'react';
import HeaderBar from '../elements/HeaderBar';
import { Select, Radio, Form, InputNumber, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const SpotGridStrategy = () => {
  const navigate = useNavigate();

  return (
    <div className="ww-page-container">
      <HeaderBar text='Spot Grid Strategy'/>
      <Form>
        <Form.Item className="">
          <div className="sg-price-wrap">
            <Select
              style={{ width: 120 }}
              options={[
                { value: 'BTC', label: 'BTC' },
                { value: 'ETC', label: 'ETC' },
              ]}
            />
            <div className="sg-price">$30000</div>
            <div className="sg-price-changes">+3.02%</div>
          </div>
        </Form.Item>
        <Form.Item>
          <Radio.Group>
            <Radio.Button value="1">Buy at low</Radio.Button>
            <Radio.Button value="2">Sell at high</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <h3>Grid Range</h3>
        <Form.Item>
          <InputNumber style={{ width: '100%' }} prefix="From" suffix="USD"/>
        </Form.Item>
        <Form.Item>
          <InputNumber style={{ width: '100%' }} prefix="To" suffix="USD" />
        </Form.Item>
        <h3>Grid Mode</h3>
        <Form.Item>
          <Radio.Group>
            <Radio.Button value="1">Arithmetic</Radio.Button>
            <Radio.Button value="2">Geometric</Radio.Button>
            <Radio.Button value="3">Quantatity</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => { navigate('/SpotGridBot') }}>Create a Bot to Run</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SpotGridStrategy;