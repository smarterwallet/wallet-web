import { Button, Form, Input } from 'antd';

export default function SinglePartyAccount_SignUp(props: { onChange?: () => void }) {
  return (
    <div>
      <Form
        layout="horizontal"
        onFinish={(values) => {
          console.log('submit data:', values);
          props.onChange && props.onChange();
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
            Sign up
          </Button>
        </div>
      </Form>
    </div>
  );
}
