import HeaderBar from '../../../elements/HeaderBar';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { Button, Collapse, Form, Input } from 'antd';
import SinglePartyAccount_SignUp from '../single/SinglePartyAccount_SignUp';

export default function MultiParty_SignUp_Local(props: {}) {
  return (
    <div className="px-[20px]">
      <HeaderBar text="Authorize Others" />

      <div>
        <Form
          onFinish={(values) => {
            console.log('submit data:', values);
            window.history.back();
          }}
        >
          <Form.Item name="walletAccount" label="Wallet account:" rules={[{ required: true }]}>
            <Input onChange={console.log} placeholder="" />
          </Form.Item>
          <Form.Item name="blockchainAddress" label="Blockchain address:" rules={[{ required: true }]}>
            <Input onChange={console.log} placeholder="" />
          </Form.Item>
          <Form.Item name="email" label="Send invitation:" rules={[{ required: true }]}>
            <Input onChange={console.log} placeholder="E-Mail" />
          </Form.Item>
          <div className="ww-tc">
            <Button block color="primary" size="large">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
