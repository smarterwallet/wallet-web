import { Form, Input, Picker, Button } from 'antd-mobile';
import { useState } from 'react';
import { TransactionDetail } from '../../index';

type Props = TransactionDetail & {
  onChange: (key: keyof TransactionDetail, value: any) => void;
};
const AddressForm: React.FC<Props> = ({ source, target, address, receiver, amount, token, onChange }) => {
  const [visible, setVisible] = useState(false);
  const [blockchain, setBlockChain] = useState<(string | null)[]>(['']); // 會被props傳進來 這裏做交互測試
  const blockchainColumns = [[{ label: 'Mumbai', value: 'mumbai' }], [{ label: 'Fuji', value: 'fuji' }]];

  return (
    <div>
      <Form>
        <Form.Header>Address:</Form.Header>
        <Form.Item>
          <Input />
        </Form.Item>

        <Form.Header>Blockchain:</Form.Header>
        <Form.Item>
          <Button className="w-full border-none" onClick={() => setVisible(true)}>
            选择网络
          </Button>
          <Picker
            columns={blockchainColumns}
            value={blockchain}
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}
            onConfirm={(v) => {
              //   setBlockChain(v);
              onChange('source', v);
            }}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddressForm;
