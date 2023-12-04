import { Form, Input, Picker, Button } from 'antd-mobile';
import { useState } from 'react';

const SendForm = () => {
  const [amount, useAmount] = useState();

  // picker mockdata
  const [visible, setVisible] = useState(false); 
  const [token, setToken] = useState<(string | null)[]>(['']); // 會被props傳進來 這裏做交互測試
  // data
  const tokenColumns = [[{ label: 'USDC', value: 'usdc' }],[{label: 'usdc',value: 'usdc'}]];

  return (
    <div>
      <Form>
        <Form.Header>Token:</Form.Header>
        <Form.Item>
          <Button className="w-full border-none" onClick={() => setVisible(true)}>
           { token[0] === 'usdc' ? token[0].toUpperCase() : 'Token'}
          </Button>
          <Picker
            columns={tokenColumns}
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}
            value={token}
            onConfirm={v => {
              //@ts-ignore
              setToken(v)
            }}
          />
        </Form.Item>

        <Form.Header>Amount:</Form.Header>
        <Form.Item>
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};

export default SendForm;
