import React from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Space, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './styles.scss';
import { ethers } from 'ethers';
import { Global } from '../../../server/Global';
import { TxUtils } from '../../../server/utils/TxUtils';

const SignUp = () => {
  const navigate = useNavigate();

  const encryptKey = (privKey: string, password: string) => {
    let str = password + privKey;
    let key = window.btoa(str); // encrypt
    // console.log("smarter-wallet-key:", key)
    localStorage.setItem('smarter-wallet-key', key);

    // generate loginkey
    str = password + key;
    key = window.btoa(str); // encrypt
    // console.log("loginkey:", key)
    localStorage.setItem('loginkey', key);
  }

  const register = async (values: any) => {
    if (values.password.trim() === '') {
      message.error('Password can not be empty.');
      return;
    }

    if (values.password !== values.repeatPassword) {
      message.error('The passwords entered twice do not match');
      return;
    }

    let smarterWalletKey = localStorage.getItem('smarter-wallet-key');
    if (smarterWalletKey != null && smarterWalletKey !== '') {
      message.warning('You have already registered please login directly.');
      return;
    }

    message.info('Registering...');

    let account = ethers.Wallet.createRandom();

    encryptKey(account.privateKey, values.password);

    // create smart contract account on chain
    let params = {
      "address": account.address
    }
    let tx = await Global.account.createSmartContractWalletAccount(params);
    await TxUtils.checkTransactionStatus(Global.account.ethersProvider, tx.body["result"]);

    Global.account.initAccount(account.privateKey);
    let address = Global.account.contractWalletAddress;

    localStorage.setItem('address', address);
    Global.account.isLoggedIn = true;

    // this.setState({navigate: '/login', message: ''});
    navigate('/signin/singlePartyAccount')
  }

  return (
    <div className="ww-page-container">
      <HeaderBar text='Sign up'/>
      <div className="ww-alpha-container">
        <h2>Register at local device</h2>
        <Form className="ww-signup-form" onFinish={register}>
          <Form.Item
            label="Password"
            name="password"
          >
            <Input.Password
              iconRender={(visible) => (visible ? <EyeTwoTone rev={undefined} /> : <EyeInvisibleOutlined rev={undefined} />)}
            />
          </Form.Item>
          <Form.Item
            name="repeatPassword"
            label={(<div style={{
              lineHeight: 1.2
            }}
            >
              <div>Repeat</div>
              <div>Password</div>
            </div>)}
          >
            <Input.Password
              iconRender={(visible) => (visible ? <EyeTwoTone rev={undefined} /> : <EyeInvisibleOutlined rev={undefined} />)}
            />
          </Form.Item>
          <Button
            htmlType="submit"
            style={{width: '100%'}}
          >Register</Button>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;