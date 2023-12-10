import { Button, Form, Input, Space, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Global } from '../../../server/Global';
import { TxUtils } from '../../../server/utils/TxUtils';
import { ethers } from 'ethers';

interface SignupPayload {
  password: string;
  repeatPassword: string;
}

const SinglePartyAccount = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const signUp = async (values: SignupPayload) => {
    if (
      values.password == null ||
      values.password === '' ||
      values.repeatPassword == null ||
      values.repeatPassword === ''
    ) {
      message.error('Password can not be empty.');
      return;
    }
    const password = values.password.trim();

    if (password !== values.repeatPassword.trim()) {
      message.error('The passwords entered twice do not match');
      return;
    }

    if (Global.account?.existLocalStorageKey()) {
      message.error('You have already signed up please login directly.');
      return;
    }

    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Create account...',
      duration: 0,
    });
    let account = ethers.Wallet.createRandom();

    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Save key to local storage...',
      duration: 0,
    });
    if (!Global.account.saveKey2LocalStorage(account.privateKey, password)) {
      message.error('Save key to local storage error.');
      return;
    }

    // create smart contract account on chain
    let params = {
      address: account.address,
    };
    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Create wallet on chain....',
      duration: 0,
    });
    let tx = await Global.account.createSmartContractWalletAccount(params);
    await TxUtils.waitForTransactionUntilOnChain(Global.account.ethersProvider, tx.body['result']);

    messageApi.loading({
      key: Global.messageTypeKeyLoading,
      content: 'Init Smarter AA Wallet....',
      duration: 0,
    });
    Global.tempLocalPassword = password;
    await Global.account.initAccount(account.privateKey);
    Global.account.isLoggedIn = true;
    messageApi.success({
      key: Global.messageTypeKeyLoading,
      content: 'Jump to single party account page',
      duration: 0,
    });
    navigate('/signin/singlePartyAccount');
  };

  return (
    <>
      {contextHolder}
      <Form className="ww-signup-form" onFinish={signUp}>
        <Form.Item label="Password" name="password">
          <Input.Password
            iconRender={(visible) =>
              visible ? <EyeTwoTone rev={undefined} /> : <EyeInvisibleOutlined rev={undefined} />
            }
          />
        </Form.Item>

        <Form.Item name="repeatPassword" label="Repeat">
          <Input.Password
            iconRender={(visible) =>
              visible ? <EyeTwoTone rev={undefined} /> : <EyeInvisibleOutlined rev={undefined} />
            }
          />
        </Form.Item>

        <Button htmlType="submit" style={{ width: '100%' }}>
          Sign up
        </Button>
      </Form>
    </>
  );
};

export default SinglePartyAccount;
