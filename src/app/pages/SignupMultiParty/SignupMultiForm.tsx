import { Button, Form, Input, Select, message, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import { Global } from '../../../server/Global';
import { HttpUtils } from '../../../server/utils/HttpUtils';
import { Config } from '../../../server/config/Config';
import { useState } from 'react';
import CountDownButton from '../../component/CountDownButton';
import { MPCManageAccount } from '../../../server/account/MPCManageAccount';
import { JSONBigInt } from '../../../server/js/common_utils';
import { parseNumbers } from '../../../server/js/mpc_wasm_utils';
import ProviderTab from './ProviderTab';

const SignupMultiForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [provider, setProvider] = useState<string>('spark');
  // const [password, setPassword] = useState<string>('');
  // const [email, setEmail] = useState<string>('');

  const register = async (values: any) => {
    const email = form.getFieldValue('email');
    const code = form.getFieldValue('code');
    const password = form.getFieldValue('password');
    // console.log(`password is ${password}`);
    Global.tempLocalPassword = password;
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Register on Smarter AA Wallet...',
      duration: 0,
    });
    const result = await HttpUtils.post(Config.BACKEND_API + '/sw/user/register', {
      email: email,
      code: code,
    });
    if (result.body['code'] != 200) {
      message.error(result.body['message']);
      messageApi.destroy();
      return;
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Init MPC account...',
      duration: 0,
    });
    await Global.changeAccountType(2);
    const mpc = Global.account as MPCManageAccount;
    Global.authorization = result.body['result'];
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Generate MPC key...',
      duration: 0,
    });
    const keys = await mpc.generateKeys();
    if (keys == null || keys === '') {
      message.error('Generate MPC keys error');
      messageApi.destroy();
      return;
    }
    const key1 = JSONBigInt.stringify(parseNumbers(keys['p1JsonData']));
    const key2 = JSONBigInt.stringify(parseNumbers(keys['p2JsonData']));
    const key3 = JSONBigInt.stringify(parseNumbers(keys['p3JsonData']));

    if (Global.tempLocalPassword == null || Global.tempLocalPassword === '') {
      message.error('Local password error');
      return;
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Save key to local storage...',
      duration: 0,
    });
    if (!mpc.saveKey2LocalStorage(key1, Global.tempLocalPassword)) {
      message.error('Save key to local storage error');
      messageApi.destroy();
      return;
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Save MPC key to wallet server...',
      duration: 0,
    });
    const save2Server = await mpc.saveKey2WalletServer(key2);
    if (save2Server.body['code'] != 200) {
      message.error('Save MPC key to wallet server error. Details: ' + save2Server.body['message']);
      messageApi.destroy();
      return;
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Save key to decentralize storage...',
      duration: 0,
    });
    const save2DS = await mpc.saveKey2DecentralizeStorage(key3, Global.tempLocalPassword);
    if (save2DS.status != 200) {
      message.error('Save key to decentralize storage error');
      messageApi.destroy();
      return;
    }
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Save third key hash to local storage...',
      duration: 0,
    });
    if (!mpc.saveKeyThirdHash2LocalStorage(save2DS.body['result']['result'], Global.tempLocalPassword)) {
      message.error('Save third key hash to local storage error');
      messageApi.destroy();
      return;
    }

    Global.tempLocalPassword = null;
    messageApi.success({
      key: Global.messageTypeKeyLoading,
      content: 'Sign up successfully...',
      duration: 2,
    });
    navigate('/signupSuccessfully');
  };

  const sendCode = async (values: any) => {
    const email = form.getFieldValue('email');
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Sending',
      duration: 0,
    });

    const resultOfSendEmail = await HttpUtils.post(Config.BACKEND_API + '/sw/user/email-code', {
      email: email,
    });
    if (resultOfSendEmail.body.code !== 200) {
      messageApi.error({
        content: 'Please input your Email',
      });
      return;
    }

    messageApi.success({
      key: Global.messageTypeKeyLoading,
      type: 'success',
      content: 'Send email code success!',
      duration: 2,
    });
  };

  const validSendCode = (): boolean => {
    const email = form.getFieldValue('email');
    console.log(email);
    if (!email) {
      messageApi.error({
        content: 'Please input your Email',
      });
      return false;
    }
    return true;
  };

  return (
    <div>
      {contextHolder}
      <Form form={form} onFinish={register}>
        <Form.Item label="Password" name="password">
          <Input.Password
            // value={password}
            // onChange={(value: any) => setPassword(value)}
            style={{ width: '403px' }}
            iconRender={(visible) =>
              visible ? <EyeTwoTone rev={undefined} /> : <EyeInvisibleOutlined rev={undefined} />
            }
          />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input
            // value={email}
            // onChange={(value: any) => setEmail(value)}
            style={{ width: '403px' }}
          />
        </Form.Item>

        <Form.Item label="Provider" name="provider">
          <Select
            defaultValue="Spark"
            onChange={(value) => setProvider(value)}
            value={provider}
            style={{ width: '403px', height: '80px' }}
            options={[
              { value: 'Spark', label: <ProviderTab text="Spark" iconPath="/icon/spark.png" /> },
              { value: 'MailMaster', label: <ProviderTab text="MailMaster" iconPath="/icon/mailmaster.png" /> },
              { value: 'Airmail', label: <ProviderTab text="Airmail" iconPath="/icon/airmail.png" /> },
              { value: 'Others', label: <ProviderTab text="Others..." /> },
            ]}
          ></Select>
        </Form.Item>

        <Form.Item label="Code" name="code">
          <Space>
            <Input style={{ width: '295px', marginLeft: '-100px', marginRight: '40px' }} />
            <CountDownButton
              // emailfield={form.getFieldValue('email')}
              // passfield={form.getFieldValue('password')}
              className="ww-mini-btn"
              onClick={sendCode}
              valid={validSendCode}
              storageKey="multi-part-email-send-code"
              style={{ width: '155px', height: '80px', fontSize: '25px' }}
            >
              Send
            </CountDownButton>
          </Space>
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" style={{ width: '100%' }}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignupMultiForm;
