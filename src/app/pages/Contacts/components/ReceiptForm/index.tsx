import { Button, Form, Input } from 'antd-mobile';
import { useState } from 'react';
import AddressForm from '../AddressForm';
import { TransactionDetail } from '../..';

type Props = TransactionDetail & {
  onChange: (key: keyof TransactionDetail, value: any) => void;
};

const ReceiptForm: React.FC<Props> = ({ source, target, address, receiver, amount, token, onChange }) => {
  const [newContact, setNewContant] = useState(false);
  // 用於添加聯繫人 與父頁面隔離
  //   const [address] = useState();
  const [blockchain] = useState();

  return (
    <div>
      <Form>
        <Form.Header>Name:</Form.Header>
        <Form.Item>
          <Input />
        </Form.Item>
        {/* 交互添加聯繫人發生 */}
        {!newContact ? (
          <Button className="w-full mg-y" onClick={() => setNewContant(true)}>
            Add Contact
          </Button>
        ) : (
          <AddressForm
            source={source}
            target={target}
            address={address}
            receiver={receiver}
            amount={amount}
            token={token}
            onChange={onChange}
          />
        )}
      </Form>
    </div>
  );
};

export default ReceiptForm;
