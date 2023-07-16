import {Server} from './server';
import {Service} from './service';
import {BigNumber, ethers} from "ethers";
import {divideAndMultiplyByTenPowerN, ETH} from '../app/util/util';
import {UserOperation} from "../app/modals/UserOperation";
import {Asset, Config} from "./config";
import {sprintf} from 'sprintf-js';

const {arrayify} = require("@ethersproject/bytes");

const factoryAbi = require('../data/factoryAbi.json');
const simpleAccountAbi = require('../data/SimpleAccount.json');
const erc20Abi = require('../data/IERC20.json');

export class Account extends Service {
  public contractAddress: string;
  private contractAddressExist = false;
  public eoaKey: string;
  public ethersWallet: ethers.Wallet;
  private hasBeenInit = false;

  // gasPrice = gasPriceOnChain * feeRate / 100
  private feeRate = 150;

  constructor() {
    super();
  }

  isLoggedIn() {
    return Server.isLoggedIn;
  }

  loggedIn() {
    Server.isLoggedIn = true;
  }

  loggedOut() {
    Server.isLoggedIn = false;
  }

  async initAccount(eoaKey: string) {
    console.log("eoaKey:", eoaKey);
    this.eoaKey = eoaKey;
    this.ethersWallet = new ethers.Wallet(eoaKey, Server.ethersProvider);
    this.contractAddress = await this.getAddress(await this.ethersWallet.getAddress(), 0);

    this.hasBeenInit = true;
    this.contractAddressExist = false;
  }

  async flushEtherWallet() {
    if (this.hasBeenInit) {
      console.log("flushEtherWallet:: has been init")
      this.ethersWallet = new ethers.Wallet(this.eoaKey, Server.ethersProvider);
      this.contractAddress = await this.getAddress(await this.ethersWallet.getAddress(), 0);
      this.contractAddressExist = false;
    } else {
      console.log("flushEtherWallet:: has not been init")
    }
  }

  async createAccount(params: any) {
    let api = Config.BACKEND_API + '/account/onchain/create';
    return await this.sendCommand(api, params);
  }

  async getAddress(eoaAddress: string, salt: number) {
    console.log("EOA Address: ", eoaAddress, "Salt:", salt);
    let contract = new ethers.Contract(Config.ADDRESS_SIMPLE_ACCOUNT_FACTORY, factoryAbi, Server.ethersProvider);

    try {
      let address = await contract.getAddress(eoaAddress, salt);
      this.contractAddress = address;
      return address;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async balanceOfMainToken(address: string, decimals: number) {
    const balance = await Server.ethersProvider.getBalance(address);
    return divideAndMultiplyByTenPowerN(balance.toString(), decimals);
  }

  async getBalanceOf(asset: Asset) {
    if (asset.type == 1) {
      return await this.balanceOfMainToken(this.contractAddress, asset.decimals);
    } else if (asset.type == 2) {
      return await this.balanceOfERC20(asset.address, this.contractAddress, asset.decimals);
    }
  }

  async balanceOfERC20(contractAddress: string, address: string, decimals: number) {
    let contract = new ethers.Contract(contractAddress, erc20Abi, Server.ethersProvider);

    try {
      let balance = await contract.balanceOf(address);
      return divideAndMultiplyByTenPowerN(balance.toString(), decimals);
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async deployContractAddressIfNot() {
    if (!this.ethersWallet) {
      console.log("ethersWallet has not been init.")
      return;
    }
    if (this.contractAddressExist) {
      console.log("contract account has been deployed.")
      return;
    }
    console.log("start to check contract account")

    let code = await Server.ethersProvider.getCode(this.contractAddress);
    if (code != "0x") {
      this.contractAddressExist = true;
      return;
    }

    console.log("create contract")
    // create smart contract account on chain
    let params = {
      "address": this.ethersWallet.address
    }
    let tx = await Server.account.createAccount(params);
    await Server.checkTransactionStatus(tx.body["result"]);

    let newContractAddress = await Server.account.getAddress(this.ethersWallet.address, 0);

    if (this.contractAddress != newContractAddress) {
      throw new Error("Deployed contract address error. The new contract address not equals contract address")
    }
    this.contractAddressExist = true;
  }

  async contractAccountNonce(address: string) {
    let contract = new ethers.Contract(address, simpleAccountAbi, Server.ethersProvider);

    try {
      return (await contract.nonce()).toBigInt();
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async getEOAAccountNonce(address: string): Promise<number> {
    return await Server.ethersProvider.getTransactionCount(address);
  }

  async getGasPrice() {
    let gasPrice = await Server.ethersProvider.getGasPrice();
    return gasPrice.mul(BigNumber.from(this.feeRate)).div(BigNumber.from(100))
  }

  sendMainTokenCall(toAddress: string, amount: BigNumber) {
    const accountContract = new ethers.Contract("", simpleAccountAbi, Server.ethersProvider);
    return accountContract.interface.encodeFunctionData('execute', [toAddress, amount, "0x"]);
  }

  sendERC20TokenCall(contractAddress: string, toAddress: string, amount: BigNumber) {
    const accountContract = new ethers.Contract("", simpleAccountAbi, Server.ethersProvider);
    const ERC20Contract = new ethers.Contract(contractAddress, erc20Abi, Server.ethersProvider);
    const transferCallData = ERC20Contract.interface.encodeFunctionData('transfer', [toAddress, amount]);

    return accountContract.interface.encodeFunctionData('execute', [contractAddress, 0, transferCallData]);
  }

  async buildTx(contractAddress: string, amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber) {
    const senderAddress = Server.account.contractAddress;
    const nonce = await this.contractAccountNonce(senderAddress);
    // TODO check SWT balance is enough(>0)
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
    const paymasterDataSign = await Server.account.ethersWallet.signMessage(arrayify(paymasterSignPackHash));
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
    const {chainId} = await Server.ethersProvider.getNetwork();
    const packData = ethers.utils.defaultAbiCoder.encode(["bytes32", "address", "uint256"],
        [hash, entryPointAddress, chainId]);
    const userOpHash = ethers.utils.keccak256(packData);

    // sender sign UserOperator
    signature = await Server.account.ethersWallet.signMessage(arrayify(userOpHash));

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
    return userOperation;
  }

  async sendMainToken(amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber) {
    let op = await this.buildTx(null, amount, toAddress, tokenPaymasterAddress, entryPointAddress, gasPrice);
    await this.sendUserOperation({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_sendUserOperation",
      "params": [
        op,
        entryPointAddress
      ]
    });
  }

  async sendERC20Token(contractAddress: string, amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber) {
    let op = await this.buildTx(contractAddress, amount, toAddress, tokenPaymasterAddress, entryPointAddress, gasPrice);
    await this.sendUserOperation({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_sendUserOperation",
      "params": [
        op,
        entryPointAddress
      ]
    });
  }

  async sendUserOperation(params: any) {
    return await this.sendCommand(Config.BUNDLER_API, params);
  }

  async getMainTokenTxList() {
    return await this.getRequest(sprintf(Config.MAIN_TOKEN_TX_LIST_API, Server.account.contractAddress));
  }

  async getMainTokenInternalTxList() {
    return await this.getRequest(sprintf(Config.MAIN_TOKEN_TX_LIST_INTERNAL_API, Server.account.contractAddress));
  }

  async getTokenTxListByFromAddr(contractAddress: string) {
    return await this.getRequest(sprintf(Config.ERC20_TX_FROM_LIST_API, contractAddress, Server.account.contractAddress.substring(2)));
  }

  async getTokenTxListByToAddr(contractAddress: string) {
    return await this.getRequest(sprintf(Config.ERC20_TX_TO_LIST_API, contractAddress, Server.account.contractAddress.substring(2)));
  }
}

