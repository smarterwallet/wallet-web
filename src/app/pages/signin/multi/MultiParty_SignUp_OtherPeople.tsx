import HeaderBar from '../../../elements/HeaderBar';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { Button, Collapse, Form, Input } from 'antd-mobile';
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
          footer={
            <Button block type="submit" color="primary" size="large">
              Submit
            </Button>
          }
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
        </Form>
      </div>
    </div>
  );
}
