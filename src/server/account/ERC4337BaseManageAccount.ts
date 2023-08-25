import {Global} from '../Global';
import {HttpUtils} from '../utils/HttpUtils';
import {BigNumber, ethers} from "ethers";
import {divideAndMultiplyByTenPowerN, ETH} from '../../app/util/util';
import {UserOperation} from "../../app/modals/UserOperation";
import {Asset, Config} from "../config/Config";
import {sprintf} from 'sprintf-js';
import {AccountInterface} from "./AccountInterface";
import {TxUtils} from "../utils/TxUtils";

const {arrayify} = require("@ethersproject/bytes");

const simpleAccountFactoryAbi = require('../../data/SimpleAccountFactory.json');
const simpleAccountAbi = require('../../data/SimpleAccount.json');
const erc20Abi = require('../../data/IERC20.json');
const commonConfig = require('../../app/config/common.json');

/**
 * Account Manage Base Class
 */
export class ERC4337BaseManageAccount implements AccountInterface {

  /**
   * a data for init account
   */
  private _initData: any;

  /**
   * smart contract address for saving the asset
   */
  private _contractWalletAddress: string;
  private _contractWalletAddressSalt: number;

  /**
   * if the wallet has already been created
   */
  private _contractAddressExist: boolean;

  /**
   * EOA address's wallet client
   */
  private _ethersWallet: ethers.Wallet;
  private _ethersProvider: ethers.providers.JsonRpcProvider;

  /**
   * account init
   */
  private _hasBeenInit: boolean;

  /**
   * gasPrice = gasPriceOnChain * feeRate / 100
   */
  private _feeRate: number;

  /**
   * account has login
   */
  private _isLoggedIn: boolean;

  /**
   * common config
   */
  private _commonConfig: any;

  constructor() {
    this._contractAddressExist = false;
    this._hasBeenInit = false;
    this._feeRate = 150;
    this._isLoggedIn = false;
  }

  get initData(): any {
    return this._initData;
  }

  set initData(value: any) {
    this._initData = value;
  }

  get contractWalletAddress(): string {
    return this._contractWalletAddress;
  }

  set contractWalletAddress(value: string) {
    this._contractWalletAddress = value;
  }

  get contractWalletAddressSalt(): number {
    return this._contractWalletAddressSalt;
  }

  set contractWalletAddressSalt(value: number) {
    this._contractWalletAddressSalt = value;
  }

  get contractAddressExist(): boolean {
    return this._contractAddressExist;
  }

  set contractAddressExist(value: boolean) {
    this._contractAddressExist = value;
  }

  get ethersWallet(): ethers.Wallet {
    return this._ethersWallet;
  }

  set ethersWallet(value: ethers.Wallet) {
    this._ethersWallet = value;
  }

  get hasBeenInit(): boolean {
    return this._hasBeenInit;
  }

  set hasBeenInit(value: boolean) {
    this._hasBeenInit = value;
  }

  get feeRate(): number {
    return this._feeRate;
  }

  set feeRate(value: number) {
    this._feeRate = value;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  get ethersProvider(): ethers.providers.JsonRpcProvider {
    return this._ethersProvider;
  }

  set ethersProvider(value: ethers.providers.JsonRpcProvider) {
    this._ethersProvider = value;
  }

  get commonConfig(): any {
    return this._commonConfig;
  }

  set commonConfig(value: any) {
    this._commonConfig = value;
  }

  /**
   * must call initAccount in subclass
   * call it after change network
   * @param data
   */
  async initAccount(data: any) {
    this._initData = data;
    this._hasBeenInit = true;
    this._commonConfig = JSON.parse(JSON.stringify(commonConfig));
  }

  async createSmartContractWalletAccount(params: any): Promise<{ status: number, body?: any }> {
    let api = Config.BACKEND_API + '/account/onchain/create';
    return await HttpUtils.post(api, params);
  }

  async calcContractWalletAddress(): Promise<string> {
    console.log("Owner EOA Address: ", await this.getOwnerAddress());
    console.log("Salt:", this.contractWalletAddressSalt);
    let contract = new ethers.Contract(Config.ADDRESS_SIMPLE_ACCOUNT_FACTORY, simpleAccountFactoryAbi, this.ethersProvider);
    try {
      return await contract.getAddress(this.getOwnerAddress(), this.contractWalletAddressSalt);
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async getBalanceOfMainToken(address: string, decimals: number): Promise<string> {
    const balance = await this.ethersProvider.getBalance(address);
    return divideAndMultiplyByTenPowerN(balance.toString(), decimals);
  }

  async getBalanceOf(asset: Asset): Promise<string> {
    if (asset.type === 1) {
      return await this.getBalanceOfMainToken(this.contractWalletAddress, asset.decimals);
    } else if (asset.type === 2) {
      return await this.getBalanceOfERC20(asset.address, this.contractWalletAddress, asset.decimals);
    }
  }

  async getBalanceOfERC20(contractAddress: string, address: string, decimals: number): Promise<string> {
    let contract = new ethers.Contract(contractAddress, erc20Abi, this.ethersProvider);
    try {
      let balance = await contract.balanceOf(address);
      return divideAndMultiplyByTenPowerN(balance.toString(), decimals);
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async deployContractWalletIfNotExist(contractAddress: string) {
    if (this.ethersWallet == null) {
      console.log("ethersWallet has not been init.")
      return;
    }
    if (this.contractAddressExist) {
      console.log("contract account has been deployed.")
      return;
    }
    console.log("start to check contract account")

    let code = await this.ethersProvider.getCode(this.contractWalletAddress);
    if (code !== "0x") {
      this.contractAddressExist = true;
      return;
    }

    console.log("create contract")
    // create smart contract account on chain
    let params = {"address": contractAddress}
    let tx = await Global.account.createSmartContractWalletAccount(params);
    await TxUtils.checkTransactionStatus(this.ethersProvider, tx.body["result"]);

    let newContractAddress = this.contractWalletAddress;

    if (this._contractWalletAddress !== newContractAddress) {
      throw new Error("Deployed contract address error. The new contract address not equals contract address")
    }
    this._contractAddressExist = true;
  }

  async getContractWalletAddressNonce(): Promise<string> {
    let contract = new ethers.Contract(this.contractWalletAddress, simpleAccountAbi, this.ethersProvider);

    try {
      return (await contract.nonce()).toBigInt();
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async getOwnerAddress(): Promise<string> {
    throw new Error("need to implement");
  }

  async getOwnerAddressNonce(): Promise<number> {
    throw new Error("need to implement");
  }

  async getGasPrice(): Promise<BigNumber> {
    let gasPrice = await this.ethersWallet.getGasPrice();
    return gasPrice.mul(BigNumber.from(this._feeRate)).div(BigNumber.from(100))
  }

  protected sendMainTokenCall(toAddress: string, amount: BigNumber): string {
    const accountContract = new ethers.Contract("", simpleAccountAbi, this.ethersProvider);
    return accountContract.interface.encodeFunctionData('execute', [toAddress, amount, "0x"]);
  }

  protected sendERC20TokenCall(contractAddress: string, toAddress: string, amount: BigNumber): string {
    const accountContract = new ethers.Contract("", simpleAccountAbi, this.ethersProvider);
    const ERC20Contract = new ethers.Contract(contractAddress, erc20Abi, this.ethersProvider);
    const transferCallData = ERC20Contract.interface.encodeFunctionData('transfer', [toAddress, amount]);
    return accountContract.interface.encodeFunctionData('execute', [contractAddress, 0, transferCallData]);
  }

  async ownerSign(hash: string): Promise<string> {
    return await this.ethersWallet.signMessage(arrayify(hash));
  }

  async buildTx(contractAddress: string, amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber): Promise<UserOperation> {
    const senderAddress = this.contractWalletAddress;
    const nonce = await this.getContractWalletAddressNonce();
    // check SWT balance is enough
    let tokenPaymasterAmount = await this.getBalanceOf(Config.TOKENS[Config.TOKEN_PAYMASTER_TOKEN_NAME]);
    if (parseFloat(tokenPaymasterAmount) < 1) {
      throw new Error(`You must have one TokenPayMaster's token(${Config.TOKEN_PAYMASTER_TOKEN_NAME}) at least`);
    }
    const initCode = "0x";
    let callData;
    if (contractAddress != null) {
      callData = this.sendERC20TokenCall(contractAddress, toAddress, ETH(amount));
    } else {
      callData = this.sendMainTokenCall(toAddress, ETH(amount));
    }
    // TODO 参数确定方式还需要讨论
    const callGasLimit = 210000;
    const verificationGasLimit = 210000;
    const preVerificationGas = 210000;
    const maxFeePerGas = gasPrice;
    const maxPriorityFeePerGas = gasPrice;
    let paymasterAndData;
    let signature = "0x";

    // paymaster sign
    let paymasterSignPack = ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256", "bytes", "bytes", "uint256", "uint256",
          "uint256", "uint256", "uint256"],
        [senderAddress, nonce, initCode, callData, callGasLimit, verificationGasLimit,
          preVerificationGas, maxFeePerGas, maxPriorityFeePerGas]);
    const paymasterSignPackHash = ethers.utils.keccak256(paymasterSignPack);
    // 测试的TokenPaymaster不包含验证逻辑，所以签名没有进行验证
    const paymasterDataSign = await this.ethersWallet.signMessage(arrayify(paymasterSignPackHash));
    paymasterAndData = ethers.utils.defaultAbiCoder.encode(
        ["bytes20", "bytes"],
        [tokenPaymasterAddress, paymasterDataSign]);

    // calculation UserOperation hash for sign
    let userOpPack = ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256", "bytes", "bytes", "uint256", "uint256",
          "uint256", "uint256", "uint256", "bytes", "bytes"],
        [senderAddress, nonce, initCode, callData, callGasLimit, verificationGasLimit,
          preVerificationGas, maxFeePerGas, maxPriorityFeePerGas, paymasterAndData, signature]);
    // remove signature
    userOpPack = userOpPack.substring(0, userOpPack.length - 64);
    const hash = ethers.utils.keccak256(userOpPack);
    const {chainId} = await this.ethersProvider.getNetwork();
    const packData = ethers.utils.defaultAbiCoder.encode(["bytes32", "address", "uint256"],
        [hash, entryPointAddress, chainId]);
    const userOpHash = ethers.utils.keccak256(packData);

    // sender sign UserOperator
    signature = await this.ownerSign(userOpHash);

    const userOperation: UserOperation = {
      sender: senderAddress,
      nonce: nonce.toString(),
      initCode: initCode,
      callData: callData,
      callGasLimit: callGasLimit.toString(),
      verificationGasLimit: verificationGasLimit.toString(),
      preVerificationGas: preVerificationGas.toString(),
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
      paymasterAndData: paymasterAndData,
      signature: signature,
    };
    // console.log(userOperation)
    return userOperation;
  }

  async sendMainToken(amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber): Promise<{ status: number, body?: any }> {
    let op = await this.buildTx(null, amount, toAddress, tokenPaymasterAddress, entryPointAddress, gasPrice);
    return await this.sendUserOperation({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_sendUserOperation",
      "params": [
        op,
        entryPointAddress
      ]
    });
  }

  async sendERC20Token(contractAddress: string, amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber): Promise<{ status: number, body?: any }> {
    let op = await this.buildTx(contractAddress, amount, toAddress, tokenPaymasterAddress, entryPointAddress, gasPrice);
    return await this.sendUserOperation({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_sendUserOperation",
      "params": [
        op,
        entryPointAddress
      ]
    });
  }

  async sendUserOperation(params: any): Promise<{ status: number, body?: any }> {
    return await HttpUtils.post(Config.BUNDLER_API, params);
  }

  async getMainTokenTxList(): Promise<{ status: number, body?: any }> {
    return await HttpUtils.get(sprintf(Config.MAIN_TOKEN_TX_LIST_API, this.contractWalletAddress));
  }

  async getMainTokenInternalTxList(): Promise<{ status: number, body?: any }> {
    return await HttpUtils.get(sprintf(Config.MAIN_TOKEN_TX_LIST_INTERNAL_API, this.contractWalletAddress));
  }

  async getTokenTxListFromThisAddr(tokenContractAddress:string): Promise<{ status: number, body?: any }> {
    return await HttpUtils.get(sprintf(Config.ERC20_TX_FROM_LIST_API, tokenContractAddress, this.contractWalletAddress.substring(2)));
  }

  async getTokenTxListToThisAddr(tokenContractAddress:string): Promise<{ status: number, body?: any }> {
    return await HttpUtils.get(sprintf(Config.ERC20_TX_TO_LIST_API, tokenContractAddress, this.contractWalletAddress.substring(2)));
  }

}

