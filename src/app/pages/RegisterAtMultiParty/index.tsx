import React from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { Button, Form, Input, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

const RegisterAtMultiParty = () => {
  const navigate = useNavigate();
  return (
    <div className="ww-page-container rmp-page">
      <HeaderBar text="Register At Multi Party" />
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
            <Button>Send Code</Button>
          </Space>
        </Form.Item>
        <Button
          type="primary"
          style={{ width: '100%'}}
          onClick={() => {
            navigate('/registerSuccessfully')
          }}
        >Register</Button>
      </Form>
      <p className="mpa-tip">At least 2 of 3 keys will be required to login successfully</p>
    </div>
  );
};

export default RegisterAtMultiParty;