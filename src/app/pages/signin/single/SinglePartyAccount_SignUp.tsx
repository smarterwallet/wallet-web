import { Button, Form, Input } from 'antd-mobile';

export default function SinglePartyAccount_SignUp(props: { onChange?: () => void }) {
  return (
    <div>
      <Form
        layout="horizontal"
        onFinish={(values) => {
          console.log('submit data:', values);
          props.onChange && props.onChange();
        }}
        footer={
          <Button block type="submit" color="primary" size="large">
            Register
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
