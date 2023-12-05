import { Form, Input, Picker, Button, Card } from 'antd-mobile';
import { useState } from 'react';
import { TransactionDetail } from '../../index';
import './styles.scss';

type Props = TransactionDetail & {
  onChange: (key: keyof TransactionDetail, value: any) => void;
}
const AddressForm: React.FC<Props> = ({ source, target, address, receiver, amount, token, onChange, }) => {
  const [visible, setVisible] = useState(false);
  const [blockchain, setBlockChain] = useState<(string | null)[]>(['']); // 會被props傳進來 這裏做交互測試
  const blockchainColumns = [[{ label: 'Mumbai', value: 'mumbai' },{ label: 'Fuji', value: 'fuji' } ]];

  return (
    <div className="bg-transparent h-[28rem] flex flex-col">
      {/* address */}
      <div className="grow flex flex-col px-16 justify-center">
        <div className="mb-2">
          <h1 className="font-bold text-4xl">Address:</h1>
        </div>
        <div className="bg-white rounded-3xl px-5 shadow-xl">
          <Input></Input>
        </div>
      </div>
      <div className=" grow flex flex-col px-16 justify-center">
        <div className="mb-2">
          <h1 className="font-bold text-4xl">Blockchain:</h1>
        </div>
        <div className="bg-white rounded-3xl px-5 shadow-xl">
          <Input
            onClick={() => setVisible(true)}
            value={receiver.toUpperCase()}
            placeholder="Choose network"
            style={{ '--text-align': 'center' , caretColor: "transparent"}}
            className='text-4xl'
          />
          <Picker
            columns={blockchainColumns}
            visible={visible}
            value={blockchain}
            onClose={() => {
              setVisible(false);
            }}
            onConfirm={(v) => {
              onChange('receiver',v[0])
            }}
          ></Picker>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
