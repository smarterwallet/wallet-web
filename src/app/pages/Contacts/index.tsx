import { Tabs, Form, Input, Button } from 'antd-mobile';
import React from 'react';
import BackBtn from '../../component/BackBtn';
import { useState } from 'react';
import AddressForm from './components/AddressForm';
import SendForm from './components/SendForm';
import ReceiptForm from './components/ReceiptForm';

type Props = {};

export type TransactionDetail = {
  address?: string;
  amount?: number | string;
  token?: string;
  receiver?: string;
  source?: 'Mumbai' | 'Fuji';
  target?: 'Mumbai' | 'Fuji';
};

const initialTransactionDetail = {
  address: '', // 发送人地址
  amount: '', // 发送数量
  token: '', // 代币类型
  receiver: '', // 接收人地址
};

const Contacts: React.FC<Props> = () => {
  const mockSend = () => {};
  // props傳遞value下去 子組件
  // const [address] = useState();
  // const [amount] = useState();
  // const [token] = useState();
  // const [block] = useState();
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail>(initialTransactionDetail);

  const handleTransactionDetail = (key: keyof TransactionDetail, value: any) => {
    setTransactionDetail((prev) => ({ ...prev, [key]: value })); // 把变量名为 key 的值设为 value
  };

  return (
    <div className="h-80">
      <BackBtn />
      <main className="grid grid-flow-row gap-4">
        {/* Send Form*/}
        <div className="mx-8">
          <h1 className="" style={{ color: '#0A3D53' }}>
            Send
          </h1>
          <SendForm />
        </div>
        {/* To Form*/}
        <div>
          <h1 className="mx-8" style={{ color: '#0A3D53' }}>
            To
          </h1>
          <Tabs style={{ background: '#D9D9D9B2', margin: 'none' }}>
            <Tabs.Tab title="Address" key="add">
              <AddressForm {...transactionDetail} onChange={handleTransactionDetail} />
            </Tabs.Tab>
            <Tabs.Tab title="Receipt" key="rec">
              <ReceiptForm {...transactionDetail} onChange={handleTransactionDetail} />
            </Tabs.Tab>
          </Tabs>
        </div>
        {/* Send Btn*/}
        <div>
          <Button block size="large" className="rounded-2xl" onClick={() => mockSend()}>
            {' '}
            Send <i>&gt;</i>{' '}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Contacts;
