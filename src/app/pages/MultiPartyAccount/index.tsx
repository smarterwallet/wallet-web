import React from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { Button, Checkbox, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import './styles.scss'

const MultiPartyAccount = () => {
  const navigate = useNavigate();
  return (
    <div className="ww-page-container mpa-page">
      <HeaderBar text="Multi Party Account" />
      <p className="mpa-main-txt">What other places would you like to put two other keys in?</p>
      <Form>
        <Form.Item >
          <Checkbox >My other devices</Checkbox>
          <br/>
          <Checkbox >Wallet server</Checkbox>
          <br/>
          <Checkbox >Decentralized server</Checkbox>
        </Form.Item>
        <Button
          type="primary"
          style={{ width: '100%' }}
          onClick={() => {
            navigate('/signupAtMultiParty')
          }}
        >Next</Button>
      </Form>
      <p className="mpa-tip">At least 2 of 3 keys will be required to login successfully</p>
    </div>
  );
};

export default MultiPartyAccount;