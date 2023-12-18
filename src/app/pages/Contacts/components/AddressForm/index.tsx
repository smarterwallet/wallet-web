import {  Input, Picker, Button, } from 'antd-mobile';
import { useState } from 'react';
import { TransactionDetail } from '../../index';
import './styles.scss';

type Props = TransactionDetail & {
  onChange: (key: keyof TransactionDetail, value: any) => void;
};
const AddressForm: React.FC<Props> = ({ source, target, address, receiver, amount, token, onChange }) => {
  const [visible, setVisible] = useState(false);
  const [blockchain, setBlockChain] = useState<(string | null)[]>(['']); // 會被props傳進來 這裏做交互測試
  const blockchainColumns = [
    [
      { label: 'Mumbai', value: 'mumbai' },
      { label: 'Fuji', value: 'fuji' },
    ],
  ];

  return (
    <div className="bg-transparent h-[30rem] flex flex-col">
      {/* address */}
      <div className="grow flex flex-col px-16 justify-center">
        <div className="mb-2">
          <h1 className="font-bold text-4xl" style={{ color: '#0A3D53' }}>
            Address:
          </h1>
        </div>
        <div className="bg-white rounded-3xl px-5 shadow-xl">
          <Input
            className="text-4xl"
            style={{ '--font-size': '4rem' }}
            value={receiver}
            onChange={(v) => onChange('receiver', v)}
            clearable
          ></Input>
        </div>
      </div>
      <div className=" grow flex flex-col px-16 justify-center">
        <div className="mb-2">
          <h1 className="font-bold text-4xl " style={{ color: '#0A3D53' }}>
            Blockchain:
          </h1>
        </div>
        <div className="bg-white rounded-3xl px-5 shadow-xl">
          <Button
            onClick={() => setVisible(true)}
            style={{ height: '80px', }}
            className="text-4xl border-none"
            block
            size='large'
          >{target ? target.toUpperCase() : ''}</Button>
          <Picker
            columns={blockchainColumns}
            visible={visible}
            value={blockchain}
            onClose={() => {
              setVisible(false);
            }}
            onConfirm={(v) => {
              onChange('target', v[0]);
            }}
          ></Picker>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
