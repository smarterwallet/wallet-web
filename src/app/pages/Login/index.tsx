import HeaderBar from "../../elements/HeaderBar";
import React, { useState } from "react";
import { Button, Collapse, Form, Input, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Global } from '../../../server/Global';
import './styles.scss';
import { EOAManageAccount } from "../../../server/account/EOAManageAccount";
import { MPCManageAccount } from "../../../server/account/MPCManageAccount";
import { HttpUtils } from "../../../server/utils/HttpUtils";
import { Config } from "../../../server/config/Config";
import { JSONBigInt } from "../../../server/js/common_utils";

export default () => {

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState('1');
  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';

  const eoaLogin = async (values: any) => {
    if (Global.isMPCAccount()) {
      setActiveKey('2');
      message.info('Your account type is mpc account, which requires you to make an email login');
      return;
    }
    if (!values.localPassword) {
      return message.error('Please input password');
    }
    await Global.changeAccountType(1);
    const eoaAccount = Global.account as EOAManageAccount;
    const eoaKey = eoaAccount.getKeyFromLocalStorage(values.localPassword.trim())

    if (eoaKey != null && eoaKey !== "") {
      message.info('Login...');
      await Global.account.initAccount(eoaKey);
      Global.account.isLoggedIn = true;

      navigate('/home')
    } else {
      message.error('Password incorrect');
    }
  }
  const sendEmailCode = async (values: any) => {
    const email = form.getFieldValue('email');
    messageApi.open({
      key,
      type: 'loading',
      content: 'Sending...',
    });
    await HttpUtils.post(Config.BACKEND_API + "/sw/user/email-code", {
      "email": email,
    })
    messageApi.open({
      key,
      type: 'success',
      content: 'Send email code success!',
      duration: 2,
    });
  }

  const mpcLogin = async (values: any) => {
    try {
      messageApi.open({
        key,
        type: 'loading',
        content: 'Init MPC account...',
      });
      await Global.changeAccountType(2);
      const mpcAccount = Global.account as MPCManageAccount;
      messageApi.open({
        key,
        type: 'loading',
        content: 'Decrpty local MPC key...',
        duration: 2,
      });
      const mpcPassword = form.getFieldValue('mpcPassword');
      const mpcKey1 = mpcAccount.getKeyFromLocalStorage(mpcPassword)
      if (mpcKey1 == null || mpcKey1 === "") {
        message.error('Local password incorrect');
        return;
      }

      messageApi.open({
        key,
        type: 'loading',
        content: 'Login wallet server...',
        duration: 3,
      });
      const email = form.getFieldValue('email');
      const code = form.getFieldValue('code');
      const result = await HttpUtils.post(Config.BACKEND_API + "/sw/user/login", {
        "email": email,
        "code": code
      })
      if (result.body["code"] != 200) {
        message.error(result.body["message"]);
        return;
      }

      messageApi.open({
        key,
        type: 'loading',
        content: 'Init local MPC key..',
        duration: 4,
      });
      mpcAccount.authorization = result.body["result"];
      await Global.account.initAccount(JSONBigInt.stringify(mpcKey1));

      messageApi.open({
        key,
        type: 'success',
        content: 'Jump to home page',
        duration: 5,
      });

      console.log("result.body result:", result.body["result"])
      Global.account.isLoggedIn = true;
      navigate('/home')
    } catch (error: any) {
      message.error((error as Error).message);
    }
  }


  return (
    <div className="ww-page-container">
      {contextHolder}
      <HeaderBar text='Login' />
      <Collapse
        defaultActiveKey="1"
        activeKey={activeKey}
        className="ww-collapse"
        accordion
        onChange={(key) => setActiveKey(key as string)}
        items={[
          {
            label: 'Local login',
            key: '1',
            children: (<Form onFinish={eoaLogin}>
              <Form.Item
                label="Password"
                name="localPassword"
              >
                <Input.Password />
              </Form.Item>
              <Button
                htmlType="submit"
                style={{ width: '100%' }}
              >Login</Button>
            </Form>)
          },
          {
            label: 'Multi-party Login',
            key: '2',
            children: (<Form form={form} className="ww-multi-party-form" onFinish={mpcLogin}>
              <Form.Item
                label="Password"
                name="mpcPassword"
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Code"
                name="code"
              >
                <Space>
                  <Input />
                  <Button className="ww-mini-btn" onClick={sendEmailCode}>Send Code</Button>
                </Space>
              </Form.Item>
              <Button
                // type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >Login</Button>
            </Form>)
          },
        ]}
      />
    </div>
  )
}
