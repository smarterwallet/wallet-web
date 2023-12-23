import React, { useEffect, useState } from 'react';
import { Global } from '../../../server/Global';
import { Config } from '../../../server/config/Config';
import { SendErrorCheck } from './utils/ErrorCheck';
import { BlockChains } from './utils/blockchainConfig';
import { useCrossChain } from './utils/useCrossChain';
import { Tabs } from 'antd-mobile';

import AddressForm from './components/AddressForm';
import SendForm from './components/SendForm';
import ReceiptForm from './components/ReceiptForm';
import BackBtn from '../../component/BackBtn';
import SendBtn from './components/SendBtn';
import Cross from '../Cross';

import './styles.scss';
import { useMessageBox } from './utils/useMessageBox';
import { useBalance } from './utils/useBalance';
import { onSameBlockChainTransfer } from './utils/transfer';

const _parseFloat = (input: number | string) => {
  return parseFloat(input?.toString());
};

// for "avax fuji" to 'fuji'
const TagConversion = (tag: any) => {
  if (tag == 'avax fuji') return 'fuji';
  return tag;
};

const OtherChain = (current: 'mumbai' | 'fuji') => {
  return current === 'mumbai' ? 'fuji' : 'mumbai';
};

type Props = {};

type BlockchainType = 'mumbai' | 'avax fuji' | 'moonbase';

export type TransactionDetail = {
  address?: string;
  amount?: string | number;
  token?: string;
  receiver?: string;
  source?: BlockchainType;
  target?: BlockchainType;
};

const initialTransactionDetail = {
  address: '', // 发送人地址
  amount: '', // 发送数量
  token: '', // 代币类型
  receiver: '', // 接收人地址
};

const tabItems = [
  { key: 'add', title: 'Address' },
  { key: 'rec', title: 'Receipt' },
];

const Contacts: React.FC<Props> = () => {
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail>(initialTransactionDetail);
  const [tradingMode, setTradingMode] = useState(true); // 为了实现添加联系人时，控制send 按钮不渲染。
  const [activeKey, setActiveKey] = useState(tabItems[0].key); // tabs
  const [isTrading, setTrading] = useState(false);
  const [isCross, crossDetial, crossChain] = useCrossChain();
  const [successMessageBox, errorMessageBox, infoMessageBox, contextHolder] = useMessageBox();
  const [balanceData] = useBalance();

  const handleTransactionDetail = (key: keyof TransactionDetail, value: any) => {
    setTransactionDetail((prev) => ({ ...prev, [key]: value })); // 把变量名为 key 的值设为 value
  };

  // 获得当前链 和 发送人地址
  useEffect(() => {
    const setSourceBlockChain = () => {
      try {
        handleTransactionDetail('source', Config.CURRENT_CHAIN_NAME.toLowerCase());
        console.log('Current blockchain is:', transactionDetail.source);
      } catch (e) {
        console.error(e);
      }
    };
    const setCurrentAddress = () => {
      try {
        handleTransactionDetail('address', Global.account.contractWalletAddress);
        console.log('Current Sender address is:', transactionDetail.address);
      } catch (e) {
        console.error(e);
      }
    };

    setSourceBlockChain();
    setCurrentAddress();
  }, []);

  const handleTransfer = async () => {
    if (isTrading === true) return;
    try {
      const { address, amount, source, receiver, target, token } = transactionDetail;
      infoMessageBox('Error Checking..');
      const errorMessage = await SendErrorCheck(transactionDetail, balanceData);
      if (errorMessage !== null) {
        console.error(errorMessage);
        errorMessageBox(errorMessage);
        return;
      }
      ////Transfer
      const senderBlockChain = TagConversion(source); // source 是Config.Current_chain_name 获取的
      const targetBlockChain = TagConversion(target);
      console.log(balanceData[token]?.toString());
      console.log(balanceData[token]?.toString());
      console.log(senderBlockChain);
      console.log(targetBlockChain);
      if (_parseFloat(balanceData[token]?.toString()) > _parseFloat(amount) && senderBlockChain === targetBlockChain) {
        // 本链钱够
        infoMessageBox(`starting ${senderBlockChain} to ${targetBlockChain} transfer`);
        setTrading(true);
        const BlockChain_Config = BlockChains[senderBlockChain];
        await onSameBlockChainTransfer({ BlockChain_Config, amount, receiver, token });
        console.log('transfer');
        console.log({ BlockChain_Config, amount, receiver, token });
        successMessageBox('Transfer finish');
      } else if (
        _parseFloat(balanceData[token]?.toString()) > _parseFloat(amount) &&
        senderBlockChain !== targetBlockChain
      ) {
        // 跨链
        infoMessageBox('Initializing CrossChain-transfer');
        // // 使用Cross组件
        crossChain({
          receiver: receiver,
          amount: amount,
          source: senderBlockChain,
          target: targetBlockChain,
          token: token as 'USDC' | 'usdc',
        });
      } else {
        errorMessageBox("You'r Wallet balance can't afford any Transfer");
      }
      setTrading(false);
    } catch (e) {
      errorMessageBox(e as string);
      console.error(e);
    }
  };

  return (
    <>
      {isCross ? (
        <Cross
          receiver={crossDetial.receiver}
          amount={crossDetial.amount}
          source={crossDetial.source}
          target={crossDetial.target}
          token={crossDetial.token}
          fees={crossDetial.fees}
        />
      ) : (
        <div className='contacts'>
          {contextHolder}
          <div className="">
            <BackBtn />
          </div>

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
                    style={
                      activeKey === 'add' ? { fontWeight: 'bold', backgroundColor: 'rgba(217, 217, 217, 0.7)' } : {}
                    }
                  >
                    <AddressForm {...transactionDetail} onChange={handleTransactionDetail} />
                  </Tabs.Tab>
                  <Tabs.Tab
                    title="Receipt"
                    key="rec"
                    className="h-28 flex items-center"
                    style={
                      activeKey === 'add' ? {} : { fontWeight: 'bold', backgroundColor: 'rgba(217, 217, 217, 0.7)' }
                    }
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
            <div className="flex-auto px-5 mb-[140px]">
              {tradingMode && <SendBtn handleTransfer={handleTransfer} isTrading={isTrading} />}
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default Contacts;
