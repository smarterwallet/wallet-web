import React from 'react';
import { Select, Form, InputNumber, Button, Space, Modal } from 'antd';
import HeaderBar from '../../elements/HeaderBar';
import { useNavigate } from 'react-router-dom';
import '../SpotGrid/styles.scss';

const Index = () => {
  const navigate = useNavigate();

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
        <h3>Trading asset</h3>
        <Space>
          <Form.Item>
            <Select defaultValue="Type" className="ww-selector">
              <Select.Option value="Type">Type</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <InputNumber placeholder="Amount"/>
          </Form.Item>
        </Space>
        <h3>Starting condition</h3>
        <Space>
          <Form.Item>
            <Select defaultValue="Price" className="ww-selector">
              <Select.Option value="Price">Price</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <InputNumber placeholder="Amount"/>
          </Form.Item>
        </Space>
        <h3>Ending condition</h3>
        <Space>
          <Form.Item>
            <Select defaultValue="Price" className="ww-selector">
              <Select.Option value="Price">Price</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <InputNumber placeholder="Amount"/>
          </Form.Item>
        </Space>
        <h3>Gas asset</h3>
        <Space>
          <Form.Item>
            <Select defaultValue="Type" className="ww-selector">
              <Select.Option value="Type">Type</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <InputNumber placeholder="Amount"/>
          </Form.Item>
        </Space>
        <div className="ww-tc">
          <Button shape="round" onClick={run}>Run</Button>
        </div>
      </Form>
    </div>
  );
};

export default Index;