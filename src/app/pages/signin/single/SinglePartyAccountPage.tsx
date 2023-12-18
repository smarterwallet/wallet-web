import HeaderBar from '../../../elements/HeaderBar';
import React from 'react';
import { Button, Collapse, Space, Alert, Radio, Checkbox } from 'antd';
import { CheckCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

export default function SinglePartyAccountPage(props: {}) {

  const navigate = useNavigate();

  return (
    <div className="ww-page-container single-party-account-page">
      <HeaderBar text="Single Party Account" />
      <div className="ww-alpha-container">
        <h2>Single-party account</h2>
        <div>
          <Alert
            className="ww-msg"
            message="Sign up successfully"
            type="success"
            showIcon
          />
        </div>
        <Button
          // type="primary"
          style={{ width: '100%'}}
          onClick={() => {
            navigate('/home')
          }}
        >Login</Button>
      </div>
      <div className="opacity-wrapper">
        <h2>Multi-party account</h2>
        <p className="multi-party-account-tip">
          At least 2 of 3 keys will be required to login successfully
        </p>
        <ul className="multi-party-account-tip-list">
          <li>
            <p>Wallet server</p>
            <CheckCircleOutlined rev={undefined} />
          </li>
          <li>
            <p>Decentralized storage</p>
            <CheckCircleOutlined rev={undefined} />
          </li>
        </ul>
        <Button
          style={{ width: '100%'}}
          onClick={() => {
            navigate('/signupAtMultiParty')
          }}
        >Upgrade</Button>
      </div>
    </div>
  );
}
