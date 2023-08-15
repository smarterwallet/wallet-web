import React from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Space, Form } from 'antd';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  return (
    <div className="ww-page-container">
      <HeaderBar text='Sign up'/>
      <h2>Register at local device</h2>
      <Form>
        <Form.Item
          label="Password"
        >
          <Input.Password
            placeholder="input password"
            iconRender={(visible) => (visible ? <EyeTwoTone rev={undefined} /> : <EyeInvisibleOutlined rev={undefined} />)}
          />
        </Form.Item>
        <Form.Item
          label="Repeat Password"
        >
          <Input.Password
            placeholder="repeat password"
            iconRender={(visible) => (visible ? <EyeTwoTone rev={undefined} /> : <EyeInvisibleOutlined rev={undefined} />)}
          />
        </Form.Item>
        <Button
          type="primary"
          style={{width: '100%'}}
          onClick={() => {
            navigate('/signin/singlePartyAccount')
          }}
        >Register</Button>
      </Form>
    </div>
  );
};

export default SignUp;