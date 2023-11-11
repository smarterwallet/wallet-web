import React from 'react';
import HeaderBar from '../../elements/HeaderBar';
import { Button, Form, Input, Result, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

const SignupSuccessfully = () => {
  const navigate = useNavigate();
  return (
    <div className="ww-page-container register-result-page">
      {/* <HeaderBar text="Sign up successfully" /> */}
      <Result
        style={{marginTop: '120px'}}
        status="success"
        title={<h2>Register successfully</h2>}
        subTitle={(
          <div className="subtitle">
            <strong
            >You can freely choose any other login account applications to login. There is no need to have to be the one you just registered!</strong> 
          </div>
        )}
        extra={[
          // <Button
          //   key="console"
          //   onClick={() => {
          //     navigate('/')
          //   }}
          // >
          //   Done
          // </Button>,<img src='/icon/arrow-right.png' />
          <Button
            key="buy"
            onClick={() => {
              navigate('/signin')
            }}
          ><div>Login </div>
          <img src='/icon/arrow-left.png' /></Button>,
        ]}
      />
    </div>
  );
};

export default SignupSuccessfully;