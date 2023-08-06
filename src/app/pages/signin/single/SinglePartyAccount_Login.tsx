import React, { RefObject } from 'react';
import { Form, Input, Button, DatePicker, Slider, Switch } from 'antd';
// import type { DatePickerRef } from 'antd-mobile/es/components/date-picker';

export default function SinglePartyAccount_Login(props: {}) {
  return (
    <div>
      <Form
        layout="horizontal"
        onFinish={(values) => {
          console.log('submit data:', values);
        }}
      >
        <Form.Item name="name" label="Username" rules={[{ required: true }]}>
          <Input onChange={console.log} placeholder="" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input onChange={console.log} placeholder="" />
        </Form.Item>
        <div className="ww-tc">
          <Button block color="primary" size="large">
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
}
