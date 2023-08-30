import React from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { Button, Form, Input, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './styles.scss';
import { HttpUtils } from '../../../server/utils/HttpUtils';
import { Config } from '../../../server/config/Config';
import { Global } from '../../../server/Global';
import { MPCManageAccount } from '../../../server/account/MPCManageAccount';
import { JSONBigInt } from '../../../server/js/common_utils';
import { parseNumbers } from '../../../server/js/mpc_wasm_utils';

const RegisterAtMultiParty = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const register = async (values: any) => {
    const email = form.getFieldValue('email');
    const code = form.getFieldValue('code');

    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Register on Smarter AA Wallet...',
      duration: 0,
    });
    const result = await HttpUtils.post(Config.BACKEND_API + "/sw/user/register", {
      "email": email,
      "code": code
    })
    if (result.body["code"] != 200) {
      message.error(result.body["message"]);
      return;
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Init MPC account...',
      duration: 0,
    });
    await Global.changeAccountType(2);
    const mpc = Global.account as MPCManageAccount;
    mpc.authorization = result.body["result"];
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Generate MPC key...',
      duration: 0,
    });
    const keys = await mpc.generateKeys()
    if (keys == null || keys === "") {
      message.error("Generate MPC keys error");
      return;
    }
    const key1 = JSONBigInt.stringify(parseNumbers(keys["p1JsonData"]))
    const key2 = JSONBigInt.stringify(parseNumbers(keys["p2JsonData"]))
    const key3 = JSONBigInt.stringify(parseNumbers(keys["p3JsonData"]))

    if (Global.tempLocalPassword == null || Global.tempLocalPassword === "") {
      message.error("Local password error")
      return;
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Save key to local storage...',
      duration: 0,
    });
    if (!mpc.saveKey2LocalStorage(key1, Global.tempLocalPassword)) {
      message.error("Save key to local storage error")
      return;
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Save MPC key to wallet server...',
      duration: 0,
    });
    const save2Server = await mpc.saveKey2WalletServer(key2)
    if (save2Server.body["code"] != 200) {
      message.error("Save MPC key to wallet server error. Details: " + save2Server.body["message"])
      return;
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Save key to decentralize storage...',
      duration: 0,
    });
    const save2DS = await mpc.saveKey2DecentralizeStorage(key3, Global.tempLocalPassword);
    if (save2DS.status != 200) {
      message.error("Save key to decentralize storage error")
      return;
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Save third key hash to local storage...',
      duration: 0,
    });
    if (!mpc.saveKeyThirdHash2LocalStorage(save2DS.body["result"]["result"], Global.tempLocalPassword)) {
      message.error("Save third key hash to local storage error")
      return;
    }

    Global.tempLocalPassword = null;
    messageApi.success({
      key: Global.messageTypeKeyLoading,
      content: 'Register successfully...',
      duration: 2,
    });
    navigate('/registerSuccessfully');
  }

  const sendCode = async (values: any) => {
    const email = form.getFieldValue('email');
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Sending...',
      duration: 0,
    });
    await HttpUtils.post(Config.BACKEND_API + "/sw/user/email-code", {
      "email": email,
    })
    messageApi.success({
      key: Global.messageTypeKeyLoading,
      type: 'success',
      content: 'Send email code success!',
      duration: 2,
    });
  }

  return (
    <div className="ww-page-container rmp-page">
      <HeaderBar text="Multi Party Account" />
      <div className="ww-alpha-container">
        {contextHolder}
        <h2>Register At Multi Party</h2>
        <Form form={form} onFinish={register}>
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
              <Button className="ww-mini-btn" onClick={sendCode}>Send Code</Button>
            </Space>
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              style={{ width: '100%' }}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
      <p className="mpa-tip">At least 2 of 3 keys will be required to login successfully</p>
    </div>
  );
};

export default RegisterAtMultiParty;