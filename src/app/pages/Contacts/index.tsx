import { Tabs } from 'antd-mobile';
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
import { TransactionDetail as CrossTransactionDetail } from '../../types';
import { ethers } from 'ethers';
// read network data from preconfig json && write them in different project
const fujiConfig = require('../../config/fuji.json');
const polygonMumbaiConfig = require('../../config/mumbai.json');

const Fuij_Config = {
  address: localStorage.getItem('avax fujiAddress'),
  USDContact: fujiConfig.token.USDC.address,
  ADDRESS_TOKEN_PAYMASTER: fujiConfig.address.address_token_paymaster,
  ADDRESS_ENTRYPOINT: fujiConfig.address.address_entrypoint,
  Rpc_api: fujiConfig.api.rpc_api,
};

const Mumbai_Config = {
  address: localStorage.getItem('mumbaiAddress'),
  USDContact: polygonMumbaiConfig.token.USDC.address,
  ADDRESS_TOKEN_PAYMASTER: polygonMumbaiConfig.address.address_token_paymaster,
  ADDRESS_ENTRYPOINT: polygonMumbaiConfig.address.address_entrypoint,
  Rpc_api: polygonMumbaiConfig.api.rpc_api,
};
// ----------------------

// for sendTxTransferERC20Token(..., Gas)
const gasPriceQuery = async (rpc_api: string) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpc_api);
    const GasPrice = await provider.getGasPrice();
    return GasPrice;
  } catch (e) {
    console.error(e);
  }
};

// for balance
const erc20BalanceQuery = async (rpc_api: string, tokenAddress: string, walletAddress: string) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpc_api);
    const erc20Contract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      provider,
    );
    const balance = await erc20Contract.balanceOf(walletAddress);
    const formattedBalance = ethers.utils.formatUnits(balance, 6);
    return formattedBalance;
  } catch (e) {
    console.error(e);
  }
};
// for "avax fuji" to 'fuji'

const _parseFloat = (input: number | string) => {
  return parseFloat(input?.toString());
}

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

const initialCrossDatail: CrossTransactionDetail = {
  receiver: '',
  amount: '',
  fees: '',
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
  const [activeKey, setActiveKey] = useState(tabItems[0].key);
  const [balanceData, setbalanceData] = useState<BalanceData>(initialAmountAndAddressData);
  const [messageApi, contextHolder] = message.useMessage();
  const [isCross, setisCross] = useState(false);
  const [CrossDetial, setCrossDetail] = useState<CrossTransactionDetail>(initialCrossDatail);
  const [isTrading, setTrading] = useState(false);

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

  const handleInfoDetail = (key: keyof BalanceData, value: any) => {
    setbalanceData((prev) => ({ ...prev, [key]: value })); // 把变量名为 key 的值设为 value
  };

  const handleCrossDetail = (newState: CrossTransactionDetail) => {
    setCrossDetail(newState);
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
        // console.log('mumbai balance', mumbai_balance);
        // console.log('fuji balance', fuji_balance);
        handleInfoDetail('balance', { fuji: fuji_balance, mumbai: mumbai_balance });
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
  // test
  // useEffect(() => {
  //   console.log('CrossDetial has been updated',CrossDetial)
  // },[CrossDetial])

  const handleTransfer = async () => {
    if(isTrading == true) return; 
    infoMessageBox('Start Transfer');
    console.log('测试点击打印')
    // Global.account.contractWalletAddress 为发送人地址
    try {
      const { address, amount, source, receiver, target, token } = transactionDetail;
      console.log(`sender: ${address},amount: ${amount}, receiver:${receiver}`);
      console.log(`source: ${source}, target: ${target}, token: ${token}`);
      const { balance } = balanceData;
       console.log(`fuji balance:${balance['fuji']},mumbai balance:${balance['mumbai']}`);
      // error check
      const errorMessage = SendErrorCheck(transactionDetail, balanceData);
      if (errorMessage !== null) {
        console.error(errorMessage);
        errorMessageBox(errorMessage);
      }
      ////Transfer
      let T_result;
      const senderBlockChain = TagConversion(source); // source 是Config.Current_chain_name 获取的
      const targetBlockChain = TagConversion(target);
      const otherBlockChain = OtherChain(senderBlockChain); // 获得异链的Tag
      
      if (_parseFloat(balance[senderBlockChain]) > _parseFloat(amount)) {
        // 本链钱够
        if (senderBlockChain == targetBlockChain && senderBlockChain == 'mumbai') {
          //目标和本链一样
          const gas = await gasPriceQuery(Mumbai_Config.Rpc_api);
          infoMessageBox('starting mumbai to mumbai transfer')
          console.log('mumbai to mumbai...')
          setTrading(true);
         // await handleApprove();
          T_result = await Global.account.sendTxTransferERC20TokenWithUSDCPay(
            Mumbai_Config.USDContact,
            amount.toString(),
            receiver,
            Mumbai_Config.ADDRESS_TOKEN_PAYMASTER,
            Mumbai_Config.ADDRESS_ENTRYPOINT,
            gas,
          );
          infoMessageBox('Transfer finish')
          // after transfer finish
          // successMessageBox('Transfer suceess');
        } else if (senderBlockChain == targetBlockChain && senderBlockChain == 'fuji') {
          //目标和本链一样
          const gas = await gasPriceQuery(Fuij_Config.Rpc_api);
          infoMessageBox('starting fuji to fuji transfer')
          setTrading(true);
        //  await handleApprove();
          T_result = await Global.account.sendTxTransferERC20TokenWithUSDCPay(
            Fuij_Config.USDContact,
            amount.toString(),
            receiver,
            Fuij_Config.ADDRESS_TOKEN_PAYMASTER,
            Fuij_Config.ADDRESS_ENTRYPOINT,
            gas,
          );
          infoMessageBox('Transfer finish')
        }
      }
      if (_parseFloat(balance[otherBlockChain]) > _parseFloat(amount)) {
        // 异链钱够
        console.log("use other chain transfer usdc directly.");
        if (otherBlockChain == targetBlockChain && otherBlockChain == 'mumbai') {
          const gas = await gasPriceQuery(Mumbai_Config.Rpc_api);
          // Transfer
          // need solve a problem: I need to switch mumbai_blockChain to transfer usdc;
        }
        if (otherBlockChain == targetBlockChain && otherBlockChain == 'fuji') {
          const gas = await gasPriceQuery(Fuij_Config.Rpc_api);
          // Transfer
          // need solve a problem: I need to switch fuji_blockChain to transfer usdc;
        }
      } 
      if (_parseFloat(balance[senderBlockChain]) > _parseFloat(amount) && senderBlockChain != targetBlockChain) { // 跨链
        // 设数据
        console.log('Cross');
        const fees =
          +ethers.utils.formatUnits((await Global.account.ethersProvider.getFeeData()).maxPriorityFeePerGas, 'ether') *
          5000 *
          2000;
        const CrossDetial = {
          receiver,
          amount,
          source: senderBlockChain as 'mumbai' | 'fuji',
          target: targetBlockChain as 'mumbai' | 'fuji',
          token: token as 'USDC' | 'usdc',
          fees,
        };
        handleCrossDetail(CrossDetial);
        console.log('Cross Datial:', CrossDetial);
        infoMessageBox('starting cross transfer')
        // 使用Cross组件
        setisCross(true);
      } 
      setTrading(false);
      console.log('测试结束')
      //      successMessageBox()
    } catch (e) {
      errorMessageBox(e as string);
      console.error(e);
    }
  };

  return (
    <>
      {isCross ? (
        <Cross
          receiver={CrossDetial.receiver}
          amount={CrossDetial.amount}
          source={CrossDetial.source}
          target={CrossDetial.target}
          token={CrossDetial.token}
          fees={CrossDetial.fees}
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
              {tradingMode ? <SendBtn handleTransfer={handleTransfer} isTrading={isTrading} /> : null}
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default Contacts;
