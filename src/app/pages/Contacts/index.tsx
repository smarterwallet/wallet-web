import { Tabs, Form, Input, Button, Card, Result } from 'antd-mobile';
import React, { useEffect } from 'react';
import BackBtn from '../../component/BackBtn';
import { useState } from 'react';
import AddressForm from './components/AddressForm';
import SendForm from './components/SendForm';
import ReceiptForm from './components/ReceiptForm';
import './styles.scss';
import SendBtn from './components/SendBtn';
import { SendErrorCheck } from './utils/ErrorCheck';
import { Global } from '../../../server/Global';
import { message } from 'antd';
import { Config } from '../../../server/config/Config';
import Cross from '../Cross';
import { TransactionDetail as CorssTransactionDetail } from '../../types';

const fujiConfig = require('../../config/fuji.json');
const polygonMumbaiConfig = require('../../config/mumbai.json');

type Props = {};

export type TransactionDetail = {
  address?: string;
  amount?: string | number;
  token?: string;
  receiver?: string;
  source?: 'mumbai' | 'fuji';
  target?: 'mumbai' | 'fuji';
};

const initialTransactionDetail = {
  address: '', // 发送人地址
  amount: '', // 发送数量
  token: '', // 代币类型
  receiver: '', // 接收人地址
};

export type BalanceData = {
  balance?: {'fuji': number , 'mumbai': number};
};

const initialAmountAndAddressData = {
  balance: {'fuji': 0, 'mumbai': 0},
};

const tabItems = [
  { key: 'add', title: 'Address' },
  { key: 'rec', title: 'Receipt' },
];

const Fuij_Config = {
  Fuji_address : '0x54af53a5c0377F0e5C0d3990c560062182b1ce57',
  Fuji_USDContact : '0x5425890298aed601595a70AB815c96711a31Bc65',
  Fuji_ADDRESS_TOKEN_PAYMASTER : "0x188cEaFf80D32373C52837e162A52c82484D3A6b",
  Fuji_ADDRESS_ENTRYPOINT : "0x4B63443E5eeecE233AADEC1359254c5C601fB7f4"
}

const Mumbai_Config = {
  Mumbai_address: '0x4aF4AA7C0a76b9e0AA3F876F27279d8aE12B5B67',
  Mumbai_USDContact : '0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97',
  Mumbai_ADDRESS_TOKEN_PAYMASTER : "0x0F1499cBB313492a164e93f2c5a35a35246d030E",
  Mumbai_ADDRESS_ENTRYPOINT : "0xD79b0817A1Aeb55042d7b10bD25f99F17239333a"
}

const Contacts: React.FC<Props> = () => {
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail>(initialTransactionDetail);
  const [tradingMode, setTradingMode] = useState(true); // 为了实现添加联系人时，控制send 按钮不渲染。
  const [activeKey, setActiveKey] = useState(tabItems[0].key);
  const [balanceData, setbalanceData] = useState<BalanceData>(initialAmountAndAddressData);
  const [messageApi, contextHolder] = message.useMessage();
  const [isCorss, setisCorss] = useState(false);
  
  const successMessageBox = (successMessage: string) => {
    messageApi.open({
      type:'success',
      content: successMessage
    })
  }

  const errorMessageBox = (errorMessage: string) => {
    messageApi.open({
      type:'error',
      content:errorMessage
    })
  }

  const handleTransactionDetail = (key: keyof TransactionDetail, value: any) => {
    setTransactionDetail((prev) => ({ ...prev, [key]: value })); // 把变量名为 key 的值设为 value
  };

  const handleInfoDetail = (key: keyof BalanceData, value: any) => {
    setbalanceData((prev) => ({ ...prev, [key]: value })); // 把变量名为 key 的值设为 value
  };

  // 获取Balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const mumbai_balance = await Global.account.getBalanceOfERC20(Mumbai_Config.Mumbai_USDContact, Mumbai_Config.Mumbai_address, 6);
        const fuji_balance = await Global.account.getBalanceOfERC20(Fuij_Config.Fuji_USDContact,Fuij_Config.Fuji_address,6)
        console.log('mumbai',mumbai_balance)
        console.log('fuji',fuji_balance)
        handleInfoDetail('balance', { 'fuji' : fuji_balance, 'mumbai': mumbai_balance });
      } catch (e) {
        console.error('fetchBalance error is: ', e);
      }
    };
    fetchBalance();
  }, []);

    const handleTransfer = async () => {
    // Global.account.contractWalletAddress 为发送人地址
    try {
      const { address, amount, source,receiver, target } = transactionDetail;
      console.log(address, amount, receiver);
      const { balance } = balanceData
      console.log(balance['fuji'],balance['mumbai']);
      // error check
      const errorMessage = SendErrorCheck(transactionDetail,balanceData);
      if (errorMessage !== null) {
        console.error(errorMessage);
        errorMessageBox(errorMessage);
      }
      const gas = await Global.account.getGasPrice();
      ////Transfer
      let T_result;
      if(source == target) { // 同链
        switch(source) {
          case 'fuji' : {
            // T_result = Global.account.sendTxTransferERC20Token()
            break;
          }
          case 'mumbai': {
            // T_result = Global.account.sendTxTransferERC20Token()
            break;
          }
        }
      } 
      
      

    } catch (e) {
      errorMessageBox(e as string)
      console.log(e);
    }
  };

  return (
    <div>
      <div className="">
        <BackBtn />
      </div>
      {contextHolder}
      <main className="flex flex-col pt-0" style={{ height: '80vh' }}>
        {/* Send Form*/}
        <div className="flex-auto p-8 ">
          <h1 className="text-5xl" style={{ color: '#0A3D53' }}>
            Send
          </h1>
          <SendForm {...transactionDetail} onChange={handleTransactionDetail} />
        </div>
        {/* To Form*/}
        <div className="h-3/5" style={{ minHeight: '800px' }}>
          <div className="flex-auto h-16 px-8 py-4" style={{}}>
            <h1 className="text-5xl" style={{ color: '#0A3D53' }}>
              To
            </h1>
          </div>
          <div className="flex-auto p-1">
            <Tabs
              activeKey={activeKey}
              onChange={(key) => {
                setActiveKey(key);
              }}
              className=""
              style={{ margin: 'none' }}
            >
              <Tabs.Tab
                title="Address"
                key="add"
                className="h-28 flex items-center text-2xl"
                style={activeKey === 'add' ? { fontWeight: 'bold', backgroundColor: 'rgba(217, 217, 217, 0.7)' } : {}}
              >
                <AddressForm {...transactionDetail} onChange={handleTransactionDetail} />
              </Tabs.Tab>
              <Tabs.Tab
                title="Receipt"
                key="rec"
                className="h-28 flex items-center"
                style={activeKey === 'add' ? {} : { fontWeight: 'bold', backgroundColor: 'rgba(217, 217, 217, 0.7)' }}
              >
                <ReceiptForm
                  {...transactionDetail}
                  onChange={handleTransactionDetail}
                  setTradingMode={setTradingMode}
                />
              </Tabs.Tab>
            </Tabs>
          </div>
        </div>
        {/* Send Btn*/}
        <div className="flex-auto h-1/5">{tradingMode ? <SendBtn handleTransfer={handleTransfer} /> : null}</div>
      </main>
      {isCorss && <Cross />}
    </div>
  );
};

export default Contacts;
