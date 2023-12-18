import { Input, Picker, Button, } from 'antd-mobile';
import { useState } from 'react';
import { TransactionDetail } from '../../index';
import './styles.scss';

type Props = TransactionDetail & {
  onChange: (key: keyof TransactionDetail, value: any) => void;
};

const SendForm: React.FC<Props> = ({ source, target, address, receiver, amount, token, onChange }) => {
  // picker mockdata
  const [visible, setVisible] = useState(false);
  // data
  const tokenColumns = [[{ label: 'USDC', value: 'usdc' }]];

  return (
    <div className="grid grid-flow-row box-border">
      <div className="flex h-6 max-h-24 mb-10 " style={{ height: '5.5rem' }}>
        <div className="flex items-center justify-center text-4xl font-bold w-56" style={{ color: '#053346' }}>
          <span>Token:</span>
        </div>
        <div className="flex  justify-center">
          <Button className="border-none rounded-3xl w-96 text-4xl" block onClick={() => setVisible(true)}>
            {token != '' ? token.toUpperCase() : token}
          </Button>
          <Picker
            columns={tokenColumns}
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}
            // @ts-ignore
            value={token}
            onConfirm={(v) => {
              onChange('token', v[0]);
            }}
          ></Picker>
        </div>
      </div>
      <div className="flex  h-6 " style={{ height: '5.5rem' }}>
        <div className="flex items-center justify-center text-4xl font-bold w-56" style={{ color: '#053346' }}>
          <span className="col-span-1 text-4xl">Amount:</span>
        </div>
        <div className="bg-white rounded-3xl" style={{ width: '13rem' }}>
          <Input
            placeholder=""
            className="pl-4 text-4xl"
            style={{ '--text-align': 'center', '--font-size': '2rem' }}
            max={100}
            min={0}
            value={amount as string}
            type='number'
            onChange={(v) => onChange('amount', v)}
            clearable
          ></Input>
        </div>
        <div className="flex items-center justify-start text-2xl font" style={{ color: 'rgba(5, 51, 70, 0.8)' }}>
          <span className="col-span-1 pl-4">Max: 100</span>
        </div>
      </div>
    </div>
  );
};

export default SendForm;
