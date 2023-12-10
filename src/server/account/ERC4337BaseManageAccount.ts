import { Global } from '../Global';
import { HttpUtils } from '../utils/HttpUtils';
import { BigNumber, ContractInterface, ethers } from 'ethers';
import { divideAndMultiplyByTenPowerN, ETH } from '../../app/util/util';
import { UserOperation } from '../../app/modals/UserOperation';
import { Asset, Config } from '../config/Config';
import { sprintf } from 'sprintf-js';
import { AccountInterface, ContractCallParams } from './AccountInterface';
import { TxUtils } from '../utils/TxUtils';
import { JSONBigInt } from '../js/common_utils';
import { exec } from 'child_process';
import { parseUnits } from 'ethers/lib/utils';

const { arrayify } = require('@ethersproject/bytes');

const simpleAccountFactoryAbi = require('../../data/SimpleAccountFactory.json');
const simpleAccountAbi = require('../../data/SimpleAccount.json');
const erc20Abi = require('../../data/IERC20.json');
const autoTrandingAbi = require('../../data/AutoTrading.json');
const smarterAccountV1Abi = require('../../data/SmarterAccountV1.json');

/**
 * Account Manage Base Class
 */
export class ERC4337BaseManageAccount implements AccountInterface {
  /**
   * a data for init account after change network
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

  /**
   * must call initAccount in subclass
   * call it after change network
   * @param data
   */
  async initAccount(data: any) {
    this.initData = data;
    this.hasBeenInit = true;
    if (data != null && data !== '') {
      this.isLoggedIn = true;
    }
  }

  async createSmartContractWalletAccount(params: any): Promise<{ status: number; body?: any }> {
    let api = Config.BACKEND_API + '/ca/create';
    return await HttpUtils.post(api, params);
  }

  async calcContractWalletAddress(): Promise<string> {
    console.log('Owner EOA Address: ', await this.getOwnerAddress());
    localStorage.setItem('pk', this._ethersWallet.privateKey);

    let contract = new ethers.Contract(
      Config.ADDRESS_SIMPLE_ACCOUNT_FACTORY,
      simpleAccountFactoryAbi,
      this.ethersProvider,
    );
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

  async deployContractWalletIfNotExist(ownerAddress: string) {
    if (this.ethersWallet == null) {
      console.log('ethersWallet has not been init.');
      return;
    }
    if (this.contractAddressExist) {
      console.log('contract account has been deployed.');
      return;
    }
    console.log('start to check contract account');

    let code = await this.ethersProvider.getCode(this.contractWalletAddress);
    if (code !== '0x') {
      this.contractAddressExist = true;
      return;
    }

    console.log('create contract');
    // create smart contract account on chain
    let params = { address: ownerAddress };
    let tx = await Global.account.createSmartContractWalletAccount(params);
    await TxUtils.waitForTransactionUntilOnChain(this.ethersProvider, tx.body['result']);

    let newContractAddress = this.contractWalletAddress;

    if (this._contractWalletAddress !== newContractAddress) {
      throw new Error('Deployed contract address error. The new contract address not equals contract address');
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
    throw new Error('need to implement');
  }

  async getOwnerAddressNonce(): Promise<number> {
    throw new Error('need to implement');
  }

  async getGasPrice(): Promise<BigNumber> {
    console.log(this);

    let gasPrice = await this.ethersWallet.getGasPrice();
    return gasPrice.mul(BigNumber.from(this._feeRate)).div(BigNumber.from(100));
  }

  async ownerSign(hash: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  /**
   * Build tx
   */
  protected sendMainTokenCall(toAddress: string, amount: BigNumber): string {
    const accountContract = new ethers.Contract('', simpleAccountAbi, this.ethersProvider);
    return accountContract.interface.encodeFunctionData('execute', [toAddress, amount, '0x']);
  }

  protected sendERC20TokenCall(contractAddress: string, toAddress: string, amount: BigNumber): string {
    const accountContract = new ethers.Contract('', simpleAccountAbi, this.ethersProvider);
    const ERC20Contract = new ethers.Contract(contractAddress, erc20Abi, this.ethersProvider);
    const transferCallData = ERC20Contract.interface.encodeFunctionData('transfer', [toAddress, amount]);
    return accountContract.interface.encodeFunctionData('execute', [contractAddress, 0, transferCallData]);
  }

  protected otherContractCall(contractAddress: string, erc20Abi: string, funName: string, params: any): string {
    const accountContract = new ethers.Contract('', simpleAccountAbi, this.ethersProvider);
    const otherContract = new ethers.Contract(contractAddress, erc20Abi, this.ethersProvider);
    const callData = otherContract.interface.encodeFunctionData(funName, params);
    return accountContract.interface.encodeFunctionData('execute', [contractAddress, 0, callData]);
  }

  async buildTransferTokenTx(
    contractAddress: string,
    amount: string,
    toAddress: string,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<UserOperation> {
    let callData;
    if (contractAddress != null) {
      callData = this.sendERC20TokenCall(contractAddress, toAddress, ETH(amount));
    } else {
      callData = this.sendMainTokenCall(toAddress, ETH(amount));
    }
    return this.buildTx(callData, tokenPaymasterAddress, entryPointAddress, gasPrice);
  }

  async buildTx(
    callData: string,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<UserOperation> {
    const senderAddress = this.contractWalletAddress;
    const nonce = await this.getContractWalletAddressNonce();
    // check SWT balance is enough
    let tokenPaymasterAmount = await this.getBalanceOf(Config.TOKENS[Config.TOKEN_PAYMASTER_TOKEN_NAME]);
    if (parseFloat(tokenPaymasterAmount) < 0.1) {
      throw new Error(`You must have TokenPayMaster's token(${Config.TOKEN_PAYMASTER_TOKEN_NAME}) at least`);
    }
    const initCode = '0x';

    // TODO The way in which parameters are determined needs to be discussed
    const callGasLimit = 500000;
    const verificationGasLimit = 500000;
    const preVerificationGas = 500000;
    const maxFeePerGas = gasPrice;
    const maxPriorityFeePerGas = gasPrice;
    let paymasterAndData;
    let signature = '0x';

    // paymaster sign
    let paymasterSignPack = ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'bytes', 'bytes', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
      [
        senderAddress,
        nonce,
        initCode,
        callData,
        callGasLimit,
        verificationGasLimit,
        preVerificationGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
      ],
    );
    const paymasterSignPackHash = ethers.utils.keccak256(paymasterSignPack);
    // The tested TokenPaymaster did not contain verification logic, so the signature was not verified
    const paymasterDataSign = await this.ethersWallet.signMessage(arrayify(paymasterSignPackHash));
    paymasterAndData = ethers.utils.defaultAbiCoder.encode(
      ['bytes20', 'bytes'],
      [tokenPaymasterAddress, paymasterDataSign],
    );

    // calculation UserOperation hash for sign
    let userOpPack = ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'bytes', 'bytes', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes', 'bytes'],
      [
        senderAddress,
        nonce,
        initCode,
        callData,
        callGasLimit,
        verificationGasLimit,
        preVerificationGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        paymasterAndData,
        signature,
      ],
    );
    // remove signature
    userOpPack = userOpPack.substring(0, userOpPack.length - 64);
    const hash = ethers.utils.keccak256(userOpPack);
    const { chainId } = await this.ethersProvider.getNetwork();
    const packData = ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'address', 'uint256'],
      [hash, entryPointAddress, chainId],
    );
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
    console.log(userOperation);
    return userOperation;
  }

  /**
   * transaction list API
   */
  async getMainTokenTxList(): Promise<{ status: number; body?: any }> {
    return await HttpUtils.get(sprintf(Config.MAIN_TOKEN_TX_LIST_API, this.contractWalletAddress));
  }

  async getMainTokenInternalTxList(): Promise<{ status: number; body?: any }> {
    return await HttpUtils.get(sprintf(Config.MAIN_TOKEN_TX_LIST_INTERNAL_API, this.contractWalletAddress));
  }

  async getTokenTxListFromThisAddr(tokenContractAddress: string): Promise<{ status: number; body?: any }> {
    return await HttpUtils.get(
      sprintf(Config.ERC20_TX_FROM_LIST_API, tokenContractAddress, this.contractWalletAddress.substring(2)),
    );
  }

  async getTokenTxListToThisAddr(tokenContractAddress: string): Promise<{ status: number; body?: any }> {
    return await HttpUtils.get(
      sprintf(Config.ERC20_TX_TO_LIST_API, tokenContractAddress, this.contractWalletAddress.substring(2)),
    );
  }

  /**
   * Key management
   */
  saveKey2LocalStorage(key: string, password: string): boolean {
    throw new Error('Method not implemented.');
  }

  existLocalStorageKey(): boolean {
    throw new Error('Method not implemented.');
  }

  deleteKeyFromLocalStorage(): void {
    throw new Error('Method not implemented.');
  }

  getKeyFromLocalStorage(password: string): string {
    throw new Error('Method not implemented.');
  }

  updateLocalKey(password: string): boolean {
    throw new Error('Method not implemented.');
  }

  /**
   * Bundelr API
   */
  async sendUserOperation(op: UserOperation, entryPointAddress: string): Promise<{ status: number; body?: any }> {
    const params = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_sendUserOperation',
      params: [op, entryPointAddress],
    };
    console.log(params);
    // return await HttpUtils.post(Config.BUNDLER_API, null);
    return await HttpUtils.post(Config.BUNDLER_API, params);
  }

  async getUserOperationByHash(opHash: string): Promise<{ status: number; body?: any }> {
    const params = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getUserOperationByHash',
      params: [opHash],
    };
    return await HttpUtils.post(Config.BUNDLER_API, params);
  }

  async getUserOperationReceipt(opHash: string): Promise<{ status: number; body?: any }> {
    const params = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getUserOperationReceipt',
      params: [opHash],
    };
    return await HttpUtils.post(Config.BUNDLER_API, params);
  }

  async getTxHashByUserOperationHash(
    opHash: string,
    toAddress: string,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }> {
    return await this.getUserOperationByHash(opHash);
  }

  /**
   * Token tranaction
   */
  async sendTxTransferMainToken(
    amount: string,
    toAddress: string,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }> {
    let op = await this.buildTransferTokenTx(
      null,
      amount,
      toAddress,
      tokenPaymasterAddress,
      entryPointAddress,
      gasPrice,
    );
    return await this.sendUserOperation(op, entryPointAddress);
  }

  async sendTxTransferERC20Token(
    contractAddress: string,
    amount: string,
    toAddress: string,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }> {
    let op = await this.buildTransferTokenTx(
      contractAddress,
      amount,
      toAddress,
      tokenPaymasterAddress,
      entryPointAddress,
      gasPrice,
    );
    return await this.sendUserOperation(op, entryPointAddress);
  }

  async sendTxApproveERC20Token(
    contractAddress: string,
    toAddress: string,
    amount: BigNumber,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }> {
    let callData = this.otherContractCall(contractAddress, erc20Abi, 'approve', [toAddress, amount]);
    const op = await this.buildTx(callData, tokenPaymasterAddress, entryPointAddress, gasPrice);
    return await this.sendUserOperation(op, entryPointAddress);
  }

  /**
   * APP: auto trading
   */
  // function execSwap(uint256 strategyId, address tokenFrom, address tokenTo, uint256 tokenFromNum, uint256 tokenToNum, uint256 tokenToNumDIffThreshold)
  async signTxTradingStrategy(
    contractAddress: string,
    params: any,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<UserOperation> {
    let callData = this.otherContractCall(contractAddress, autoTrandingAbi, 'execSwap', params);
    const op = await this.buildTx(callData, tokenPaymasterAddress, entryPointAddress, gasPrice);
    return op;
  }

  // function addStrategy(address tokenFrom, address tokenTo, uint256 tokenFromNum, uint256 tokenToNum, uint256 tokenToNumDIffThreshold)
  async sendTxAddStrategy(
    contractAddress: string,
    params: any,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }> {
    let callData = this.otherContractCall(contractAddress, autoTrandingAbi, 'addStrategy', params);
    const op = await this.buildTx(callData, tokenPaymasterAddress, entryPointAddress, gasPrice);
    return await this.sendUserOperation(op, entryPointAddress);
  }

  /**
   * USDC token paymaster
   */
  // function addStrategy(address tokenFrom, address tokenTo, uint256 tokenFromNum, uint256 tokenToNum, uint256 tokenToNumDIffThreshold)
  async sendTxTransferERC20TokenWithUSDCPay(
    contractAddress: string,
    amount: string,
    toAddress: string,
    tokenPaymasterAddress: string,
    entryPointAddress: string,
    gasPrice: BigNumber,
  ): Promise<{ status: number; body?: any }> {
    let op = await this.sendTxCallContract(entryPointAddress, tokenPaymasterAddress, gasPrice, [
      {
        ethValue: '0',
        callContractAbi: erc20Abi,
        callContractAddress: contractAddress,
        callFunc: 'transfer',
        callParams: [toAddress, parseUnits(amount, 6)],
      },
    ]);
    return await this.sendUserOperation(op, entryPointAddress);
  }

  /**
   * 发送交易，调用合约
   * @param entryPointAddress
   * @param tokenPaymasterAddress
   * @param gasPrice
   * @param ethValue 交易发送ETH数量，单纯调合约时为0
   * @param callContractAbi 调用的合约ABI文件
   * @param callContractAddress 调用的合约地址
   * @param callFunc 调用的方法
   * @param callParams 调用参数
   * @returns
   */
  async sendTxCallContract(
    entryPointAddress: string,
    tokenPaymasterAddress: string,
    gasPrice: BigNumber,
    contractCalls: ContractCallParams[],
  ): Promise<UserOperation> {
    // ERC20 token 代付合约，需要先授权
    const erc20Contract = new ethers.Contract(ethers.constants.AddressZero, erc20Abi, this.ethersProvider);
    const approveZeroCallData = erc20Contract.interface.encodeFunctionData('approve', [tokenPaymasterAddress, 0]);
    const approveMaxCallData = erc20Contract.interface.encodeFunctionData('approve', [
      tokenPaymasterAddress,
      ethers.constants.MaxUint256,
    ]);
    // 组装调用的合约数据
    const execcteBatchAddress = [Config.TOKENS['USDC'].address, Config.TOKENS['USDC'].address];
    const execcteBatchValue: BigNumber[] = [BigNumber.from(0), BigNumber.from(0)];
    const execcteBatchCallData = [approveZeroCallData, approveMaxCallData];

    for (const contractCallParams of contractCalls) {
      const { ethValue, callContractAbi, callContractAddress, callFunc, callParams } = contractCallParams;
      // 组装钱包合约调用数据
      execcteBatchAddress.push(callContractAddress);
      execcteBatchValue.push(ETH(ethValue));
      const callContract = new ethers.Contract(ethers.constants.AddressZero, callContractAbi, this.ethersProvider);
      const callTxData = callContract.interface.encodeFunctionData(callFunc, callParams);
      execcteBatchCallData.push(callTxData);
    }
    const smarterAccountContract = new ethers.Contract(
      ethers.constants.AddressZero,
      smarterAccountV1Abi,
      this.ethersProvider,
    );
    const callData = smarterAccountContract.interface.encodeFunctionData('executeBatch(address[],uint256[],bytes[])', [
      execcteBatchAddress,
      execcteBatchValue,
      execcteBatchCallData,
    ]);
    // 构建UserOperation
    return await this.buildTx(callData, tokenPaymasterAddress, entryPointAddress, gasPrice);
  }
}
