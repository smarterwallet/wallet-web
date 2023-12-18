import { Input } from 'antd';
import HeaderBar from '../../elements/HeaderBar';
import './styles.scss';
import { useState, useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import { Global } from '../../../server/Global';
import { crossChainAbstractionDemand } from '../../../server/utils/ChainlinkTx';
import mumbai from '../../config/mumbai.json';
import { TransactionDetail } from '../../types';
import Cross from '../Cross';
import { message } from 'antd';
import { ethers } from 'ethers';

interface Conversations {
  content: string;
  displayButton: boolean;
  isResponse: boolean;
}
interface Ops {
  type: string;
  source_chain: string;
  token: string;
  amount: string;
  receiver: string;
  target_chain: string;
}
interface Result {
  category: string;
  detail: {
    reply: string;
    ops: Ops[];
  };
}

const DemandChat = () => {
  const [inputDemand, setInputDemand] = useState<string>('');
  const [conversation, setConversation] = useState<Conversations[]>([
    { content: 'What would you need?', displayButton: false, isResponse: true },
  ]);
  const [balanceMumbai, setBalanceMumbai] = useState<string>('');
  const chatContentRef = useRef(null);
  const [ops, setOps] = useState<Ops>();
  const [isCross, setIsCross] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail>(null);
  const [confirSuccessMessage, confirSuccessMessageHolder] = message.useMessage();

  const [messageApi, contextHolder] = message.useMessage();

  const messageBox = () => {
    message.open({
      content:'starting to transfer,please wait a second.',
      type: 'loading',
      duration: 0.75,
    })
  }

  const handleInputOnKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputDemand === '') return;
    if (event.key === 'Enter') {
      const question = { content: inputDemand, displayButton: false, isResponse: false };
      const userDemand = `Current Mumbai balance: ${balanceMumbai}USDC, Fuji balance: 0USDC. ${inputDemand}`;
      setConversation((pre) => [...pre, question]);
      setInputDemand('');
      const result: Result = await crossChainAbstractionDemand(userDemand);
      console.log(`demand response is ${result.detail.reply}`);
      if (result.detail.ops == null || result.detail.ops.length > 1) {
        setConversation((pre) => [...pre, { content: result.detail.reply, displayButton: false, isResponse: true }]);
      } else if (result.detail.ops) {
        // sendTxTransferERC20Token
        setConversation((pre) => [...pre, { content: result.detail.reply, displayButton: true, isResponse: true }]);
        setOps(result.detail.ops[0]);
      }
    }
  };

  const handleConfirmTx = async () => {
    messageBox();
    if (ops.type === 'chain-internal-transfer') {
      const gasFee = await Global.account.getGasPrice();
      confirSuccessMessage.open({
        type: 'success',
        content: 'Your transfer request has been confirmed',
      });
      Global.account.sendTxTransferERC20TokenWithUSDCPay(
        '0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97',
        ops.amount,
        ops.receiver,
        mumbai.address.address_token_paymaster,
        mumbai.address.address_entrypoint,
        gasFee,
      );
    }
    if (ops.type === 'cross-chain-transfer') {
      const fees =
          +ethers.utils.formatUnits((await Global.account.ethersProvider.getFeeData()).maxPriorityFeePerGas, 'ether') *
          5000 *
          2000;
      const txDetail: TransactionDetail = {
        receiver: ops.receiver,
        amount: ops.amount,
        source: 'mumbai',
        target: 'fuji',
        token: 'USDC',
        fees: fees,
      };
      setTransactionDetail(() => txDetail);
      setIsCross(true);
    }
  };

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [inputDemand, conversation]);
  useEffect(() => {
    const getBalance = async () => {
      const balance = await Global.account.getBalanceOfERC20('0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97', address, 6);
      setBalanceMumbai(() => balance);
      console.log(`mumbai balance is ${balance}`);
    };
    const address = Global.account.contractWalletAddress;
    getBalance();
    console.log(`address is ${address}`);
  }, []);
  return (<>
  {contextHolder}
  {!isCross ?
    (<div className="ww-page-container page-demand">
        <div>
          <HeaderBar text="Demand" returnable={false} />
          <div>{confirSuccessMessageHolder}</div>
          <div className="chat-content" ref={chatContentRef}>
            {conversation.map((item, index) => (
              <MessageItem
                key={index}
                content={item.content}
                displayButton={item.displayButton}
                isResponse={item.isResponse}
                handleConfirmTx={handleConfirmTx}
              />
            ))}
          </div>
          <div className="other-demand">
            <div className="txt">
              <Input
                type="text"
                placeholder="What else do you want?"
                value={inputDemand}
                onChange={(e) => setInputDemand(e.target.value)}
                onKeyDown={handleInputOnKeyDown}
              />
            </div>
          </div>
        </div>
        </div>) : (
        <div>
          <Cross
            receiver={transactionDetail.receiver}
            amount={transactionDetail.amount}
            source={transactionDetail.source}
            target={transactionDetail.target}
            token={transactionDetail.token}
            fees={transactionDetail.fees}
          />
        </div>
      )
    }
  </>);
};

export default DemandChat;
