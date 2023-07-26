import {Global} from '../Global';
import {HttpUtils} from '../utils/HttpUtils';
import {BigNumber, ethers} from "ethers";
import {UserOperation} from "../../app/modals/UserOperation";
import {Asset, Config} from "../config/Config";
import {AccountInterface} from "./AccountInterface";
import {BaseManageAccount} from "./BaseManageAccount";

const {arrayify} = require("@ethersproject/bytes");

/**
 * Account Manage
 */
export class MPCManageAccount extends BaseManageAccount implements AccountInterface {

  /**
   * key for sign and get MPC address
   */
  private _key: string;

  constructor() {
    super();
  }

  get key(): string {
    return this._key;
  }

  set key(value: string) {
    this._key = value;
  }

  async initAccount(key: string) {
    console.log("mpc key:", key);
    this._key = key;
    this.ethersWallet = new ethers.Wallet(key, Global.ethersProvider);
    this.contractAddress = await this.getSmartContractWalletAddress(await this.ethersWallet.getAddress(), 0);
    this.contractAddressExist = false;
    await super.initAccount(key);
  }

  async flushEtherWallet() {
    if (this.hasBeenInit) {
      console.log("flushEtherWallet:: has been init")
      this.ethersWallet = new ethers.Wallet(this._key, Global.ethersProvider);
      this.contractAddress = await this.getSmartContractWalletAddress(await this.ethersWallet.getAddress(), 0);
      this.contractAddressExist = false;
    } else {
      console.log("flushEtherWallet:: has not been init")
    }
  }

  async getMPCEOAWalletAddress(): Promise<string> {
    // TODO need to implement
    return "";
  }

  async ownerSign(hash: string): Promise<string> {
    // TODO need to implement
    return await Global.account.ethersWallet.signMessage(arrayify(hash));
  }

  async createSmartContractWalletAccount(params: any): Promise<{ status: number, body?: any }> {
    return super.createSmartContractWalletAccount(params);
  }

  async getSmartContractWalletAddress(eoaAddress: string, salt: number): Promise<string> {
    return super.getSmartContractWalletAddress(eoaAddress, salt);
  }

  async balanceOfMainToken(address: string, decimals: number): Promise<string> {
    return super.balanceOfMainToken(address, decimals);
  }

  async getBalanceOf(asset: Asset): Promise<string> {
    return super.getBalanceOf(asset);
  }

  async balanceOfERC20(contractAddress: string, address: string, decimals: number): Promise<string> {
    return super.balanceOfERC20(contractAddress, address, decimals);
  }

  async deployContractAddressIfNot(ownerAddress: string) {
    return super.deployContractAddressIfNot(ownerAddress);
  }

  async contractAccountNonce(address: string): Promise<string> {
    return super.contractAccountNonce(address);
  }

  async getOwnerAccountNonce(address: string): Promise<number> {
    return super.getOwnerAccountNonce(address);
  }

  async getGasPrice(): Promise<BigNumber> {
    return super.getGasPrice();
  }

  public sendMainTokenCall(toAddress: string, amount: BigNumber): string {
    return super.sendMainTokenCall(toAddress, amount);
  }

  public sendERC20TokenCall(contractAddress: string, toAddress: string, amount: BigNumber): string {
    return super.sendERC20TokenCall(contractAddress, toAddress, amount);
  }

  async buildTx(contractAddress: string, amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber): Promise<UserOperation> {
    return super.buildTx(contractAddress, amount, toAddress, tokenPaymasterAddress, entryPointAddress, gasPrice);
  }

  async sendMainToken(amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber): Promise<{ status: number, body?: any }> {
    return super.sendMainToken(amount, toAddress, tokenPaymasterAddress, entryPointAddress, gasPrice);
  }

  async sendERC20Token(contractAddress: string, amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber): Promise<{ status: number, body?: any }> {
    return super.sendERC20Token(contractAddress, amount, toAddress, tokenPaymasterAddress, entryPointAddress, gasPrice);
  }

  async sendUserOperation(params: any): Promise<{ status: number, body?: any }> {
    return super.sendUserOperation(params);
  }

  async getMainTokenTxList(): Promise<{ status: number, body?: any }> {
    return super.getMainTokenTxList();
  }

  async getMainTokenInternalTxList(): Promise<{ status: number, body?: any }> {
    return super.getMainTokenInternalTxList();
  }

  async getTokenTxListByFromAddr(contractAddress: string): Promise<{ status: number, body?: any }> {
    return super.getTokenTxListByFromAddr(contractAddress);
  }

  async getTokenTxListByToAddr(contractAddress: string): Promise<{ status: number, body?: any }> {
    return super.getTokenTxListByToAddr(contractAddress);
  }
}

