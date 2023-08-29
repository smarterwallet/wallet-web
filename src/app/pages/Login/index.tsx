import HeaderBar from "../../elements/HeaderBar";
import React from "react";
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

  const eoaLogin = async (values: any) => {
    Global.changeAccountType(1);
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
    HttpUtils.post(Config.BACKEND_API + "/sw/user/email-code", {
      "email": email,
    })
    message.info("send email code success")
  }

  const mpcLogin = async (values: any) => {
    message.info("Init MPC account. Please wait amount.");
    await Global.changeAccountType(2);
    const mpcAccount = Global.account as MPCManageAccount;

    const mpcPassword = form.getFieldValue('mpcPassword');
    const mpcKey1 = mpcAccount.getKeyFromLocalStorage(mpcPassword)
    if (mpcKey1 != null && mpcKey1 !== "") {
      message.info('Init local MPC key...');
      // TODO 这里有问题
      await Global.account.initAccount(JSONBigInt.stringify(mpcKey1));
    } else {
      message.error('Local password incorrect');
    }

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
    message.info("Login success");


    mpcAccount.authorization = result.body["result"];
    Global.account.isLoggedIn = true;
    navigate('/home')

    // console.log(email);
    // console.log(code);
    // console.log(mpcPassword);
    // Global.changeAccountType(2);
    // const eoaAccount  = Global.account as MPCManageAccount;
    // const mpcKey1 = eoaAccount.getKeyFromLocalStorage(values.password.trim())

    // if (mpcKey1 != null && mpcKey1 !== "") {
    //   message.info('Login...');
    //   await Global.account.initAccount(mpcKey1);
    //   Global.account.isLoggedIn = true;

    //   navigate('/home')
    // } else {
    //   message.error('Password incorrect');
    // }
  }


  return (
    <div className="ww-page-container">
      <HeaderBar text='Login' />
      <Collapse
        defaultActiveKey="1"
        className="ww-collapse"
        accordion
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
                // type="primary"
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
