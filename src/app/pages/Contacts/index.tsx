import React, { useEffect,useState } from 'react';
import { Global } from '../../../server/Global';
import { Config } from '../../../server/config/Config';
import { gasPriceQuery, erc20BalanceQuery } from './utils/etherQueryMethod';
import { SendErrorCheck } from './utils/ErrorCheck';
import { Mumbai_Config, Fuij_Config } from './utils/blockchainConfig';
import { useCrossChain } from './utils/crossChain';
import { message } from 'antd';
import { Tabs } from 'antd-mobile';

import AddressForm from './components/AddressForm';
import SendForm from './components/SendForm';
import ReceiptForm from './components/ReceiptForm';
import BackBtn from '../../component/BackBtn';
import SendBtn from './components/SendBtn';
import Cross from '../Cross';

import './styles.scss';


const _parseFloat = (input: number | string) => {
  return parseFloat(input?.toString());
}

// for "avax fuji" to 'fuji'
const TagConversion = (tag: 'mumbai' | 'avax fuji') => {
  if (tag == 'avax fuji') return 'fuji';
  return tag;
};

const OtherChain = (current: 'mumbai' | 'fuji') => {
  return current === 'mumbai' ? 'fuji' : 'mumbai';
};

type Props = {};

export type TransactionDetail = {
  address?: string;
  amount?: string | number;
  token?: string;
  receiver?: string;
  source?: 'mumbai' | 'avax fuji';
  target?: 'mumbai' | 'avax fuji';
};

const initialTransactionDetail = {
  address: '', // 发送人地址
  amount: '', // 发送数量
  token: '', // 代币类型
  receiver: '', // 接收人地址
};



export type BalanceData = {
  balance?: { fuji: number; mumbai: number };
};

const initialAmountAndAddressData = {
  balance: { fuji: 0, mumbai: 0 },
};

const tabItems = [
  { key: 'add', title: 'Address' },
  { key: 'rec', title: 'Receipt' },
];



const Contacts: React.FC<Props> = () => {
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail>(initialTransactionDetail);
  const [tradingMode, setTradingMode] = useState(true); // 为了实现添加联系人时，控制send 按钮不渲染。
  const [activeKey, setActiveKey] = useState(tabItems[0].key); // tabs
  const [balanceData, setbalanceData] = useState<BalanceData>(initialAmountAndAddressData);
  const [messageApi, contextHolder] = message.useMessage();
  const [isTrading, setTrading] = useState(false);
  const [isCross, crossDetial, crossChain] = useCrossChain();


  const successMessageBox = (successMessage: string) => {
    messageApi.open({
      type: 'success',
      content: successMessage,
    });
  };

  const errorMessageBox = (errorMessage: string) => {
    messageApi.open({
      type: 'error',
      content: errorMessage,
    });
  };

  const infoMessageBox = (infoMessage: string) => {
    messageApi.open({
      type:'info',
      content: infoMessage
    })
  }

  const handleTransactionDetail = (key: keyof TransactionDetail, value: any) => {
    setTransactionDetail((prev) => ({ ...prev, [key]: value })); // 把变量名为 key 的值设为 value
  };

  const handleBalanceDetail = (key: keyof BalanceData, value: any) => {
    setbalanceData((prev) => ({ ...prev, [key]: value })); // 把变量名为 key 的值设为 value
  };

  // 获取Balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const mumbai_balance = await erc20BalanceQuery(
          Mumbai_Config.Rpc_api,
          Mumbai_Config.USDContact,
          Mumbai_Config.address,
        );
        const fuji_balance = await erc20BalanceQuery(
          Fuij_Config.Rpc_api,
          Fuij_Config.USDContact,
          Fuij_Config.address);
        handleBalanceDetail('balance', { fuji: fuji_balance, mumbai: mumbai_balance });
      } catch (e) {
        console.error('fetchBalance error is: ', e);
      }
    };
    fetchBalance();
  }, []);
  // 获得当前链 和 发送人地址
  useEffect(() => {
    const setSourceBlockChain = () => {
      try {
      handleTransactionDetail('source', Config.CURRENT_CHAIN_NAME.toLowerCase());
      console.log('Current blockchain is:', transactionDetail.source);
      } catch(e) {
        console.error(e);
      }
    };
    const setCurrentAddress = () => {
      try {
        handleTransactionDetail('address', Global.account.contractWalletAddress);
        console.log('Current Sender address is:', transactionDetail.address);
      } catch(e) {
        console.error(e);
      }
    };

    
    setSourceBlockChain();
    setCurrentAddress();
    
  }, []);

  const handleTransfer = async () => {
    if(isTrading === true) return; 
    //console.log('测试点击打印')
    // Global.account.contractWalletAddress 为发送人地址
    try {
      const { address, amount, source, receiver, target, token } = transactionDetail;
      //console.log(`sender: ${address},amount: ${amount}, receiver:${receiver}`);
      //console.log(`source: ${source}, target: ${target}, token: ${token}`);
      const { balance } = balanceData;
      //console.log(`fuji balance:${balance['fuji']},mumbai balance:${balance['mumbai']}`);
      // error check
      infoMessageBox('Error Checking..');
      const errorMessage = await SendErrorCheck(transactionDetail, balanceData);
      if (errorMessage !== null) {
        console.error(errorMessage);
        errorMessageBox(errorMessage);
        return
      }
      ////Transfer
      const senderBlockChain = TagConversion(source); // source 是Config.Current_chain_name 获取的
      const targetBlockChain = TagConversion(target);
      const otherBlockChain = OtherChain(senderBlockChain); // 获得异链的Tag
      
      if (_parseFloat(balance[senderBlockChain]) > _parseFloat(amount) && senderBlockChain === targetBlockChain) {
        // 本链钱够
        if (senderBlockChain === targetBlockChain && senderBlockChain === 'mumbai') {
          //目标和本链一样
          const gas = await gasPriceQuery(Mumbai_Config.Rpc_api);
          infoMessageBox('starting mumbai to mumbai transfer')
        //  console.log('mumbai to mumbai...')
          setTrading(true);
         // await handleApprove();
          await Global.account.sendTxTransferERC20TokenWithUSDCPay(
            Mumbai_Config.USDContact,
            amount.toString(),
            receiver,
            Mumbai_Config.ADDRESS_TOKEN_PAYMASTER,
            Mumbai_Config.ADDRESS_ENTRYPOINT,
            gas,
          );
          successMessageBox('Transfer finish')
          // after transfer finish
          // successMessageBox('Transfer suceess');
        } else if (senderBlockChain === targetBlockChain && senderBlockChain === 'fuji') {
          //目标和本链一样
          const gas = await gasPriceQuery(Fuij_Config.Rpc_api);
          infoMessageBox('starting fuji to fuji transfer')
          setTrading(true);
        //  await handleApprove();
          await Global.account.sendTxTransferERC20TokenWithUSDCPay(
            Fuij_Config.USDContact,
            amount.toString(),
            receiver,
            Fuij_Config.ADDRESS_TOKEN_PAYMASTER,
            Fuij_Config.ADDRESS_ENTRYPOINT,
            gas,
          );
          successMessageBox('Transfer finish')
        }
      }
      // else if (_parseFloat(balance[otherBlockChain]) > _parseFloat(amount) && otherBlockChain === targetBlockChain) {
      //   // 异链钱够
      //   console.log("use other chain transfer usdc directly.");
      //   if (otherBlockChain === targetBlockChain && otherBlockChain === 'mumbai') {
      //     const gas = await gasPriceQuery(Mumbai_Config.Rpc_api);
      //     // Transfer
      //     // need solve a problem: I need to switch mumbai_blockChain to transfer usdc;
      //   }
      //   if (otherBlockChain === targetBlockChain && otherBlockChain === 'fuji') {
      //     const gas = await gasPriceQuery(Fuij_Config.Rpc_api);
      //     // Transfer
      //     // need solve a problem: I need to switch fuji_blockChain to transfer usdc;
      //   }
      // } 
      else if (_parseFloat(balance[senderBlockChain]) > _parseFloat(amount) && senderBlockChain !== targetBlockChain) { // 跨链
        infoMessageBox('Initializing CrossChain-transfer')
        // // 使用Cross组件
        crossChain({ receiver: receiver, amount : amount, source: senderBlockChain, target: targetBlockChain, token : token as ('USDC' | 'usdc') });
      } else {
        errorMessageBox("You'r Wallet balance can't afford any Transfer")
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
        <div>
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
            <div className="flex-auto h-1/5 px-5">
              {tradingMode && <SendBtn handleTransfer={handleTransfer} isTrading={isTrading} />}
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default Contacts;
