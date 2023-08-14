import HeaderBar from "../../elements/HeaderBar";
import React from "react";
import { Button, Collapse, Form, Input, Space } from 'antd';
import MenuLink from '../../component/MenuLink';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default () => {

  const navigate = useNavigate();

  return (
    <div className="ww-page-container">
      <HeaderBar text='Login'/>
      <Collapse
        defaultActiveKey="1"
        className="ww-collapse"
        accordion
        items={[
          {
            label: 'Local login',
            key: '1',
            children: (<Form>
              <Form.Item
                label="Password"
              >
                <Input.Password
                  // placeholder="input password"
                  // iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              <Button
                type="primary"
                style={{ width: '100%'}}
                onClick={() => {
                  navigate('/home')
                }}
              >Login</Button>
            </Form>)
          },
          {
            label: 'Multi-party Login',
            key: '2',
            children: (<Form>
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
                  navigate('/home')
                }}
              >Login</Button>
            </Form>)
          },
        ]}
      />
    </div>
  )
}
