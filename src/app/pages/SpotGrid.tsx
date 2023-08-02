import React, { useState } from 'react';
import HeaderBar from '../elements/HeaderBar';
import { Select, Radio, Form, InputNumber, Checkbox, Space, Button } from 'antd';
import { CurrencyType } from '../types';
import './SpotGrid.scss';

const SpotGrid = () => {
  const [currency, setCurrency] = useState<CurrencyType>('BTC');

  return (
    <div className="ww-page-container">
      <HeaderBar text='Spot Grid'/>
      <Form>
        <Form.Item className="">
          <div className="sg-price-wrap">
            <Select
              defaultValue={currency}
              style={{ width: 120 }}
              onChange={(value => setCurrency(value))}
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
        <h3>Buying Action</h3>
        <Form.Item>
          <InputNumber style={{ width: '100%' }} prefix="Amount" suffix="BTC"/>
        </Form.Item>
        <Form.Item>
          <InputNumber style={{ width: '100%' }} prefix="Value" suffix="USD" />
        </Form.Item>
        <Form.Item>
          <Checkbox>Recurring execution</Checkbox>
        </Form.Item>
        <Form.Item>
          <Checkbox>Add another strategy</Checkbox>
        </Form.Item>
        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Button>Save</Button>
            <Button>Create</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SpotGrid;