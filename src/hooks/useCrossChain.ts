import { TransactionDetail } from '../app/types';
import { Global } from '../server/Global';
import { ethers } from 'ethers';
import sourceChainSenderAbi from '../abis/sourceChainSender.abi.json';
import { Config } from '../server/config/Config';
import { useCallback, useMemo, useState } from 'react';
import erc20Abi from '../data/IERC20.json';

type LoadingState = {
  message?: 'Processing' | 'Success' | 'Error';
  error?: string;
};

// Polygon_Mumbai
const MUMBAI_DEST_CHAIN_RECEIVER = '0x4De984c203109756eb6365a696037E599dCd973C';
const MUMBAI_SOURCE_CHAIN_SENDER = '0x4eb8c2c39BF1baA0850BAb49eeF5A6D874E68b08';

// Avalanche_Fuji
const FUJI_DEST_CHAIN_RECEIVER = '0x4Ad8C9b33a5dDd7A4762948153Ebd43Bcf8E91Ad';
const FUJI_SOURCE_CHAIN_SENDER = '0x4faE92E949Ed605b9ac9E7ee1cdCA164CF54410E';
const MUMBAI_DESTINATION_CHAIN_SELECTOR = '12532609583862916517'; // Polygon Mumbai
const FUJI_DESTINATION_CHAIN_SELECTOR = '14767482510784806043'; // Avax Fuji
const FEE_TOKEN = '1';

export const useCrossChain = (transactionDetail: TransactionDetail) => {
  const { source, target, amount, receiver } = transactionDetail;

  const realAmount = ethers.utils.parseUnits(`${amount}`, 6);

  const [loadingState, setLoadingState] = useState<LoadingState>(() => ({}));

  const sourceContract = useMemo(
    () => (source === 'mumbai' ? MUMBAI_SOURCE_CHAIN_SENDER : FUJI_SOURCE_CHAIN_SENDER),
    [source],
  );
  const messageReceiver = useMemo(
    () => (target === 'mumbai' ? MUMBAI_DEST_CHAIN_RECEIVER : FUJI_DEST_CHAIN_RECEIVER),
    [target],
  );

  const destSelector = useMemo(
    () => (target === 'mumbai' ? MUMBAI_DESTINATION_CHAIN_SELECTOR : FUJI_DESTINATION_CHAIN_SELECTOR),
    [target],
  );

  const handleTx = useCallback(async () => {
    const gasPrice = await Global?.account?.getGasPrice();
    console.log(gasPrice.toString());

    setLoadingState({ message: 'Processing' });
    const crossTx = await Global?.account?.sendTxCallContract(
      Config.ADDRESS_ENTRYPOINT,
      Config.ADDRESS_TOKEN_PAYMASTER,
      gasPrice,
      [
        {
          ethValue: '0',
          callContractAbi: erc20Abi,
          callContractAddress: Config.TOKENS['USDC'].address,
          callFunc: 'approve',
          callParams: [sourceContract, ethers.constants.MaxUint256],
        },
        {
          ethValue: '0',
          callContractAbi: sourceChainSenderAbi,
          callContractAddress: sourceContract,
          callFunc: 'fund',
          callParams: [realAmount],
        },
        {
          ethValue: '0',
          callContractAbi: sourceChainSenderAbi,
          callContractAddress: sourceContract,
          callFunc: 'sendMessage',
          callParams: [destSelector, messageReceiver, FEE_TOKEN, receiver, realAmount],
        },
      ],
    );
    const crossHash = await Global.account.sendUserOperation(crossTx, Config.ADDRESS_ENTRYPOINT);
    if (crossHash.status !== 200) {
      setLoadingState({ message: 'Error', error: crossHash.body?.error || 'unknown error' });
      throw new Error(crossHash.body?.error || 'unknown error');
    }
    setLoadingState({ message: 'Success' });
    return crossHash;
  }, [realAmount, destSelector, messageReceiver, receiver, sourceContract]);



  return {
    loadingState,
    handleTx,
  };
};

export const handleApprove = async() => {
  const gasPrice = await Global?.account?.getGasPrice();

  const Tx = await Global?.account?.sendTxCallContract(
    Config.ADDRESS_ENTRYPOINT,
    Config.ADDRESS_TOKEN_PAYMASTER,
    gasPrice,
    [
      {
        ethValue: '0',
        callContractAbi: erc20Abi,
        callContractAddress: Config.TOKENS['USDC'].address,
        callFunc: 'approve',
        callParams: [Global?.account?.contractWalletAddress, ethers.constants.MaxUint256],
      },
    ],
  );
  const Hash = await Global.account.sendUserOperation(Tx, Config.ADDRESS_ENTRYPOINT);

}
