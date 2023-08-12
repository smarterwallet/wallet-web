import React, { useState } from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { Select, Radio, Form, InputNumber, Checkbox, Space, Button, message } from 'antd';
import { CurrencyType } from '../../types';
import './styles.scss';

const SpotGrid = () => {

  const save = () => {
    message.success('Saved successfully');
  }
  
  const create = () => {
    message.success('Created successfully');
  }

  return (
    <div className="ww-page-container">
      <HeaderBar text='Spot Grid'/>
      <Form
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item className="" wrapperCol={{ span: 24 }}>
          <div className="sg-price-wrap">
            <Select<CurrencyType>
              defaultValue={'ETC'}
              style={{ width: 120 }}
              options={[
                { value: 'ETC', label: 'ETC' },
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
        <h3>Buying Action</h3>
        <Form.Item label="Amount">
          <InputNumber style={{ width: '100%' }} placeholder="Matic"/>
        </Form.Item>
        <Form.Item label="Value">
          <InputNumber style={{ width: '100%' }} placeholder="USD" />
        </Form.Item>
        <Form.Item>
          <Checkbox>Recurring execution</Checkbox>
        </Form.Item>
        <Form.Item>
          <Checkbox>Add another strategy</Checkbox>
        </Form.Item>
        <Space style={{ width: '100%', justifyContent: 'center' }} size={40}>
          <Button type="primary" ghost shape="round" onClick={save}>Save</Button>
          <Button type="primary" shape="round" onClick={create}>Create</Button>
        </Space>
      </Form>
    </div>
  );
};

export default SpotGrid;