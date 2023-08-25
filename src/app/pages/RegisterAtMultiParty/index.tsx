import React from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { Button, Form, Input, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

const RegisterAtMultiParty = () => {
  const navigate = useNavigate();
  return (
    <div className="ww-page-container rmp-page">
      <HeaderBar text="Multi Party Account" />
      <div className="ww-alpha-container">
        <h2>Register At Multi Party</h2>
        <Form>
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
              <Button className="ww-mini-btn">Send Code</Button>
            </Space>
          </Form.Item>
          <Button
            style={{ width: '100%'}}
            onClick={() => {
              navigate('/registerSuccessfully')
            }}
          >Register</Button>
        </Form>
      </div>
      <p className="mpa-tip">At least 2 of 3 keys will be required to login successfully</p>
    </div>
  );
};

export default RegisterAtMultiParty;