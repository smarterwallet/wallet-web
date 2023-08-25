import React from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Space, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

const SignUp = () => {
  const navigate = useNavigate();
  return (
    <div className="ww-page-container">
      <HeaderBar text='Sign up'/>
      <div className="ww-alpha-container">
        <h2>Register at local device</h2>
        <Form className="ww-signup-form">
          <Form.Item
            label="Password"
          >
            <Input.Password
              iconRender={(visible) => (visible ? <EyeTwoTone rev={undefined} /> : <EyeInvisibleOutlined rev={undefined} />)}
            />
          </Form.Item>
          <Form.Item
            label={(<div style={{
              lineHeight: 1.2
            }}>
              <div>Repeat</div>
              <div>Password</div>
            </div>)}
          >
            <Input.Password
              iconRender={(visible) => (visible ? <EyeTwoTone rev={undefined} /> : <EyeInvisibleOutlined rev={undefined} />)}
            />
          </Form.Item>
          <Button
            // type="primary"
            style={{width: '100%'}}
            onClick={() => {
              navigate('/signin/singlePartyAccount')
            }}
          >Register</Button>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;