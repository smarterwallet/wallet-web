import { ethers } from 'ethers';
import destChainReceiverAbi from '../../abis/DestChainReceiver.abi.json';
import liquidityPoolAbi from '../../abis/liquidityPool.abi.json';
import sourceChainSenderAbi from '../../abis/sourceChainSender.abi.json';
import usdcAbi from '../../abis/usdc.abi.json';
import { Global } from '../../server/Global';

// Polygon_Mumbai
const MUMBAI_USDC = '0x9999f7fea5938fd3b1e26a12c3f2fb024e194f97';
const MUMBAI_LIQUIDITY_POOL = '0x1510c7Bd9c9c7D24B0a1c54CdEb062213A5afB79';
const MUMBAI_DEST_CHAIN_RECEIVER = '0x4De984c203109756eb6365a696037E599dCd973C';
const MUMBAI_SOURCE_CHAIN_SENDER = '0x4eb8c2c39BF1baA0850BAb49eeF5A6D874E68b08';

// Avalanche_Fuji
const Fuji_USDC = '0x5425890298aed601595a70AB815c96711a31Bc65';
const Fuji_LIQUIDITY_POOL = '0xa4064799b1BE7F708f1F75c44D863750f27A0a3E';
const Fuji_DEST_CHAIN_RECEIVER = '0x4Ad8C9b33a5dDd7A4762948153Ebd43Bcf8E91Ad';
const Fuji_SOURCE_CHAIN_SENDER = '0x4faE92E949Ed605b9ac9E7ee1cdCA164CF54410E';

const FUND_AMOUNT = ethers.utils.parseUnits('1', 6);
const destinationChainSelector = '12532609583862916517'; // Polygon Mumbai
const feeToken = '1';
const to = '0xeb23E1a2784931A65D671DaA1235c8ae6435A367';
const receiver = '0x4De984c203109756eb6365a696037E599dCd973C';
const amount = '1000000';

type TransactionDetail = {
  receiver?: string; // 接受人地址
  amount?: number | string; // 数量
  source?: string; // 发起交易的链
  target?: string; // 接收交易的链
  token?: string; // 代币种类
  address?: string; // 发起交易的地址
  fees?: string | number; // 预估交易费
};

export const handleCrossChain = async () => {
  const deployer = new ethers.Wallet(
    'ff3a619d9054ec33cd3f6934a6d9435accd8dfbb68eee507fa042dfb3b807635',
    Global.account.ethersProvider,
  );
  const signer = new ethers.Wallet(localStorage.getItem('pk'), Global.account.ethersProvider);
  const sourceChainSender = new ethers.Contract(Fuji_SOURCE_CHAIN_SENDER, sourceChainSenderAbi, deployer);
  const usdc = new ethers.Contract(Fuji_USDC, usdcAbi, signer);
  const approveTx = await usdc.approve(sourceChainSender.address, FUND_AMOUNT, { gasLimit: 5000000 });
  await approveTx.wait(1);
  console.log('fund 1 USDC to SourceChainSender Contract...');
  const fundTx = await sourceChainSender.fund(FUND_AMOUNT, {
    gasLimit: 5000000,
  });
  await fundTx.wait(1);
  console.log('transaction successfully...');
  const balance = await usdc.balanceOf(signer.address);
  console.log(`Deployer has balance: ${ethers.utils.formatEther(balance)} USDC`);

  // Call the sendMessage function to cross-chain 1 USDC to Mumbai
  console.log('Call sendMessage function...');
  const crossChainTx = await sourceChainSender.sendMessage(destinationChainSelector, receiver, feeToken, to, amount, {
    gasLimit: 5000000,
  });
  console.log(`Cross-chain transaction hash: ${crossChainTx.hash}`); // copy it to Chainlink CCIP Explorer page, check cross chain status.
  await crossChainTx.wait(1);
  console.log('Cross Chain 1 USDC from Avalanche Fuji to Polygon Mumbai is successfully!');

  return {
    approveTx,
    fundTx,
    crossChainTx,
  };
};
