import {Asset} from "../config/Config";
import {BigNumber} from "@ethersproject/bignumber";
import {UserOperation} from "../../app/modals/UserOperation";

/**
 * Account Manage Interface
 */
export interface AccountInterface {

  initAccount(data: any): void;

  flushEtherWallet(): void;

  createSmartContractWalletAccount(params: any): Promise<{ status: number, body?: any }>;

  getBalanceOfMainToken(address: string, decimals: number): Promise<string>;

  getBalanceOf(asset: Asset): Promise<string>;

  getBalanceOfERC20(contractAddress: string, address: string, decimals: number): Promise<string>;

  deployContractWalletIfNotExist(ownerAddress: string): void;

  /**
   * Get smart contract wallet address
   * @param ownerAddress EOA address for manage smart contract wallet
   * @param salt
   */
  getContractWalletAddress(ownerAddress: string, salt: number): Promise<string>;

  getContractWalletAddressNonce(contractWalletAddress: string): Promise<string>;

  /**
   * EOA address for manage smart contract wallet
   */
  getOwnerAddress(): Promise<string>;

  getOwnerAddressNonce(address: string): Promise<number>;

  getGasPrice(): Promise<BigNumber>;

  sendMainTokenCall(toAddress: string, amount: BigNumber): string;

  sendERC20TokenCall(contractAddress: string, toAddress: string, amount: BigNumber): string;

  ownerSign(hash: string): Promise<string>;

  buildTx(contractAddress: string, amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber): Promise<UserOperation>;

  sendMainToken(amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber): Promise<{ status: number, body?: any }>;

  sendERC20Token(contractAddress: string, amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber): Promise<{ status: number, body?: any }>

  sendUserOperation(params: any): Promise<{ status: number, body?: any }>

  getMainTokenTxList(): Promise<{ status: number, body?: any }>

  getMainTokenInternalTxList(): Promise<{ status: number, body?: any }>

  getTokenTxListByFromAddr(contractAddress: string): Promise<{ status: number, body?: any }>

  getTokenTxListByToAddr(contractAddress: string): Promise<{ status: number, body?: any }>
}

