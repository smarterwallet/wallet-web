import { Asset } from '../config/Config';
import { BigNumber } from '@ethersproject/bignumber';
import { ContractInterface, ethers } from 'ethers';
import { UserOperation } from '../../app/modals/UserOperation';

export interface ContractCallParams {
  ethValue: string;
  callContractAbi: ContractInterface;
  callContractAddress: string;
  callFunc: string;
  callParams?: ReadonlyArray<any>;
}

/**
 * Account Manage Interface
 */
export interface AccountInterface {
  /**
   * base state
   */
  get isLoggedIn(): boolean;

  set isLoggedIn(value: boolean);

  get initData(): any;

  set initData(value: any);

  get contractWalletAddress(): string;

  set contractWalletAddress(value: string);

  get contractWalletAddressSalt(): number;

  set contractWalletAddressSalt(value: number);

  get ethersWallet(): ethers.Wallet;

  set ethersWallet(value: ethers.Wallet);

  get ethersProvider(): ethers.providers.JsonRpcProvider;

  set ethersProvider(value: ethers.providers.JsonRpcProvider);

  /**
   * Account state
   */
  initAccount(data: any): void;

  /**
   * deploy smart contract wallet
   */
  createSmartContractWalletAccount(params: any): Promise<{ status: number; body?: any }>;

  deployContractWalletIfNotExist(ownerAddress: string): void;

  /**
   * get params and data
   */
  getBalanceOfMainToken(address: string, decimals: number): Promise<string>;

  getBalanceOf(asset: Asset): Promise<string>;

  getBalanceOfERC20(contractAddress: string, address: string, decimals: number): Promise<string>;

  getContractWalletAddressNonce(): Promise<string>;

  getOwnerAddress(): Promise<string>;

  getOwnerAddressNonce(): Promise<number>;

  getGasPrice(): Promise<BigNumber>;

  /**
   * build tx interface
   */
  ownerSign(hash: string): Promise<string>;

  sendUserOperation(op: UserOperation, entryPointAddress: string): Promise<{ status: number; body?: any }>;

  getUserOperationByHash(opHash: string): Promise<{ status: number; body?: any }>;

  getUserOperationReceipt(opHash: string): Promise<{ status: number; body?: any }>;

  sendTxTransferMainToken(
    amount: string,
    toAddress: string,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }>;

  sendTxTransferERC20Token(
    contractAddress: string,
    amount: string,
    toAddress: string,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }>;

  sendTxTransferERC20TokenWithUSDCPay(
    contractAddress: string,
    amount: string,
    toAddress: string,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }>;

  sendTxApproveERC20Token(
    contractAddress: string,
    toAddress: string,
    amount: BigNumber,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }>;

  /**
   * get tx list interface
   */
  getMainTokenTxList(): Promise<{ status: number; body?: any }>;

  getMainTokenInternalTxList(): Promise<{ status: number; body?: any }>;

  getTokenTxListFromThisAddr(tokenContractAddress: string): Promise<{ status: number; body?: any }>;

  getTokenTxListToThisAddr(tokenContractAddress: string): Promise<{ status: number; body?: any }>;

  /**
   * handle key
   */
  saveKey2LocalStorage(key: string, password: string): boolean;

  existLocalStorageKey(): boolean;

  getKeyFromLocalStorage(password: string): string;

  deleteKeyFromLocalStorage(): void;

  updateLocalKey(password: string): boolean;

  /**
   * auto trading
   */
  signTxTradingStrategy(
    contractAddress: string,
    params: any,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<UserOperation>;

  sendTxAddStrategy(
    contractAddress: string,
    params: any,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }>;

  sendTxTransferERC20TokenWithUSDCPay(
    contractAddress: string,
    amount: string,
    toAddress: string,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }>;

  sendTxCallContract(
    entryPointAddress: string,
    tokenPaymasterAddress: string,
    gasPrice: BigNumber,
    contractCalls: ContractCallParams[],
  ): Promise<UserOperation>;
}
