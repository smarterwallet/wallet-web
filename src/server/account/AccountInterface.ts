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

  getSmartContractWalletAddress(eoaAddress: string, salt: number): Promise<string>;

  balanceOfMainToken(address: string, decimals: number): Promise<string>;

  getBalanceOf(asset: Asset): Promise<string>;

  balanceOfERC20(contractAddress: string, address: string, decimals: number): Promise<string>;

  deployContractAddressIfNot(ownerAddress: string): void;

  contractAccountNonce(address: string): Promise<string>;

  getOwnerAccountNonce(address: string): Promise<number>;

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

