import React, { RefObject } from 'react';
import { Form, Input, Button, Dialog, TextArea, DatePicker, Selector, Slider, Stepper, Switch } from 'antd-mobile';
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker';

export default function SinglePartyAccount_Login(props: {}) {
  return (
    <div>
      <Form
        layout="horizontal"
        onFinish={(values) => {
          console.log('submit data:', values);
        }}
        footer={
          <Button block type="submit" color="primary" size="large">
            Login
          </Button>
        }
      >
        <Form.Item name="name" label="Username" rules={[{ required: true }]}>
          <Input onChange={console.log} placeholder="" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input onChange={console.log} placeholder="" />
        </Form.Item>
      </Form>
    </div>
  );
}
