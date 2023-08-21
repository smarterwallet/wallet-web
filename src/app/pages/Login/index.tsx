import HeaderBar from "../../elements/HeaderBar";
import React from "react";
import { Button, Collapse, Form, Input, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Global } from '../../../server/Global';

export default () => {

  const navigate = useNavigate();

  const login = async (values: any) => {
    message.info('Login...');
    let smarterWalletKey = localStorage.getItem('smarter-wallet-key');
    let loginkey = localStorage.getItem('loginkey');

    let str = values.password + smarterWalletKey;
    let tryLogin = window.btoa(str); // encrypt

    if (tryLogin === loginkey) {
      let key = window.atob(smarterWalletKey);
      key = key.substring(values.password.length, key.length);
      await Global.account.initAccount(key);
      Global.account.isLoggedIn = true;

      navigate('/home')
    } else {
      message.error('Password incorrect');
    }
  }

  return (
    <div className="ww-page-container">
      <HeaderBar text='Login'/>
      <Collapse
        defaultActiveKey="1"
        className="ww-collapse"
        accordion
        items={[
          {
            label: 'Local login',
            key: '1',
            children: (<Form onFinish={login}>
              <Form.Item
                label="Password"
              >
                <Input.Password />
              </Form.Item>
              <Button
                type="primary"
                style={{ width: '100%'}}
                onClick={() => {
                  navigate('/home')
                }}
              >Login</Button>
            </Form>)
          },
          {
            label: 'Multi-party Login',
            key: '2',
            children: (<Form>
              <Form.Item
                label="Email"
              >
                <Input/>
              </Form.Item>
              <Form.Item
                label="Code"
              >
                <Space>
                  <Input />
                  <Button>Send Code</Button>
                </Space>
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%'}}
              >Login</Button>
            </Form>)
          },
        ]}
      />
    </div>
  )
}
