import { TransactionDetail } from '../app/types';
import { Global } from '../server/Global';
import { BigNumber, ethers } from 'ethers';
// import destChainReceiverAbi from '../abis/DestChainReceiver.abi.json';
// import liquidityPoolAbi from '../abis/liquidityPool.abi.json';
import sourceChainSenderAbi from '../abis/sourceChainSender.abi.json';
import usdcAbi from '../abis/usdc.abi.json';
import { Config } from '../server/config/Config';
import { useCallback, useEffect, useMemo, useState } from 'react';

type LoadingState = {
  percent?: '25%' | '50%' | '75%' | '100%';
  message?: 'Approving...' | 'Funding...' | 'Sending Message...';
};

// fuji -----> mumbai
// Polygon_Mumbai
const MUMBAI_USDC = '0x9999f7fea5938fd3b1e26a12c3f2fb024e194f97';
// const MUMBAI_LIQUIDITY_POOL = '0x1510c7Bd9c9c7D24B0a1c54CdEb062213A5afB79';
const MUMBAI_DEST_CHAIN_RECEIVER = '0x4De984c203109756eb6365a696037E599dCd973C';
const MUMBAI_SOURCE_CHAIN_SENDER = '0x4eb8c2c39BF1baA0850BAb49eeF5A6D874E68b08';

// Avalanche_Fuji
const FUJI_USDC = '0x5425890298aed601595a70AB815c96711a31Bc65';
// const FUJI_LIQUIDITY_POOL = '0xa4064799b1BE7F708f1F75c44D863750f27A0a3E';
const FUJI_DEST_CHAIN_RECEIVER = '0x4Ad8C9b33a5dDd7A4762948153Ebd43Bcf8E91Ad';
const FUJI_SOURCE_CHAIN_SENDER = '0x4faE92E949Ed605b9ac9E7ee1cdCA164CF54410E';
const MUMBAI_DESTINATION_CHAIN_SELECTOR = '12532609583862916517'; // Polygon Mumbai
const FUJI_DESTINATION_CHAIN_SELECTOR = '14767482510784806043'; // Avax Fuji
const FEE_TOKEN = '1';

export const useCrossChain = (transactionDetail: TransactionDetail) => {
  const { source, target, amount, receiver } = transactionDetail;
  const signer = new ethers.Wallet(Global?.account?.ethersWallet?.privateKey, Global?.account?.ethersProvider);

  const [loadingState, setLoadingState] = useState<LoadingState>(() => ({}));

  const sourceContract = useMemo(
    () => (source === 'mumbai' ? MUMBAI_SOURCE_CHAIN_SENDER : FUJI_SOURCE_CHAIN_SENDER),
    [source],
  );
  const messageReceiver = useMemo(
    () => (target === 'mumbai' ? MUMBAI_DEST_CHAIN_RECEIVER : FUJI_DEST_CHAIN_RECEIVER),
    [target],
  );
  const usdc = useMemo(
    () => new ethers.Contract(source === 'mumbai' ? MUMBAI_USDC : FUJI_USDC, usdcAbi, signer),
    [source],
  );

  const sourceChainSender = useMemo(() => new ethers.Contract(sourceContract, sourceChainSenderAbi), [sourceContract]);
  const destSelector = useMemo(
    () => (target === 'mumbai' ? MUMBAI_DESTINATION_CHAIN_SELECTOR : FUJI_DESTINATION_CHAIN_SELECTOR),
    [target],
  );

  const handleApprove = useCallback(async () => {
    setLoadingState({ percent: '25%', message: 'Approving...' });
    const gasPrice = await Global?.account?.getGasPrice();
    const approveTx = await Global?.account?.sendTxApproveERC20Token(
      usdc.address,
      sourceChainSender.address,
      BigNumber.from(amount),
      Config.ADDRESS_TOKEN_PAYMASTER,
      Config.ADDRESS_ENTRYPOINT,
      gasPrice,
    );
    return approveTx;
  }, [amount, sourceChainSender.address, usdc.address]);

  const handleFund = useCallback(async () => {
    const gasPrice = await Global?.account?.getGasPrice();
    setLoadingState({ percent: '50%', message: 'Funding...' });
    Global?.account?.sendTxCallContract(
      Config.ADDRESS_ENTRYPOINT,
      Config.ADDRESS_TOKEN_PAYMASTER,
      gasPrice,
      '0',
      sourceChainSenderAbi,
      sourceContract,
      'fund',
      [amount],
    );
  }, [amount, sourceContract]);

  const handleSendMessage = useCallback(async () => {
    const gasPrice = await Global?.account?.getGasPrice();
    setLoadingState({ percent: '75%', message: 'Sending Message...' });
    Global?.account?.sendTxCallContract(
      Config.ADDRESS_ENTRYPOINT,
      Config.ADDRESS_TOKEN_PAYMASTER,
      gasPrice,
      '0',
      sourceChainSenderAbi,
      sourceContract,
      'sendMessage',
      [destSelector, messageReceiver, FEE_TOKEN, receiver, amount],
    );
  }, [amount, destSelector, messageReceiver, receiver, sourceContract]);

  useEffect(() => {}, []);

  return {
    loadingState,
    handleApprove,
    handleFund,
    handleSendMessage,
  };
};
