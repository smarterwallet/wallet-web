import { Asset } from "../config/Config";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";

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
  createSmartContractWalletAccount(params: any): Promise<{ status: number, body?: any }>;

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

  sendUserOperation(params: any): Promise<{ status: number, body?: any }>

  sendMainToken(amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber): Promise<{ status: number, body?: any }>;

  sendERC20Token(contractAddress: string, amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber): Promise<{ status: number, body?: any }>;

  /**
   * get tx list interface
   */
  getMainTokenTxList(): Promise<{ status: number, body?: any }>

  getMainTokenInternalTxList(): Promise<{ status: number, body?: any }>

  getTokenTxListFromThisAddr(tokenContractAddress: string): Promise<{ status: number, body?: any }>

  getTokenTxListToThisAddr(tokenContractAddress: string): Promise<{ status: number, body?: any }>

  saveKey2LocalStorage(key: string, password: string): boolean;

  existLocalStorageKey(): boolean;

  getKeyFromLocalStorage(password: string): string;
  
}

