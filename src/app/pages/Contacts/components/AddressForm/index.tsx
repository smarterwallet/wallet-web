import {  Input,  Button, } from 'antd-mobile';
import { useState } from 'react';
import { TransactionDetail } from '../../index';

import './styles.scss';
import { BlockchainPicker } from '../BlockchainPicker';

type Props = TransactionDetail & {
  onChange: (key: keyof TransactionDetail, value: any) => void;
};

const usePicker = () => {
  const [visible, setVisible] = useState(false);
  const [blockchain, setBlockChain] = useState<(string | null)[]>(['']);
  return { visible, setVisible, blockchain, setBlockChain}
}

const AddressForm: React.FC<Props> = ({ source, target, address, receiver, amount, token, onChange }) => {
  // Picker
  const {visible,setVisible, blockchain, setBlockChain} = usePicker()
  
  
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
          <BlockchainPicker  visible={visible} setVisible={setVisible} onChange={onChange} blockchain={blockchain} />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
