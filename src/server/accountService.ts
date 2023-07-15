import {Server} from './server';
import {Service} from './service';
import {BigNumber, ethers} from "ethers";
import {divideAndMultiplyByTenPowerN, ETH} from '../app/util/util';
import {UserOperation} from "../app/modals/UserOperation";
import {Asset, Config} from "./config";

const {arrayify} = require("@ethersproject/bytes");

const factoryAbi = require('../data/factoryAbi.json');
const usdtpmAbi = require('../data/usdtpmAbi.json');
const simpleAccountAbi = require('../data/SimpleAccount.json');
const erc20Abi = require('../data/IERC20.json');
const util = require('util');

export class AccountService extends Service {
  public contractAddress: string;
  public ethersWallet: ethers.Wallet;
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

  async initWalletAndContractAddress(eoaKey: string) {
    this.ethersWallet = new ethers.Wallet(eoaKey, Server.ethersProvider);
    this.contractAddress = await this.getAddress(await this.ethersWallet.getAddress(), 0);
  }

  async createAccount(params: any) {
    let api = 'https://smarter-api.web3-idea.xyz/be/account/onchain/create';
    return await this.sendCommand(api, params);
  }

  async getAddress(eoaAddress: string, salt: number) {
    console.log("EOA Address: ", eoaAddress);
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
    let contract = new ethers.Contract(contractAddress, usdtpmAbi, Server.ethersProvider);

    try {
      let balance = await contract.balanceOf(address);
      return divideAndMultiplyByTenPowerN(balance.toString(), decimals);
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async contractAccountNonce(address: string) {
    let contract = new ethers.Contract(address, simpleAccountAbi, Server.ethersProvider);

    try {
      return await contract.nonce();
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
    // https://github.com/ethers-io/ethers.js/issues/478#issuecomment-495814010
    let ABI = ["function execute(address dest, uint256 value, bytes calldata func)"];
    let iface = new ethers.utils.Interface(ABI);
    return iface.encodeFunctionData("execute", [toAddress, amount, "0x"]);
  }

  sendERC20TokenCall(contractAddress: string, toAddress: string, amount: BigNumber) {
    const contract = new ethers.Contract(contractAddress, erc20Abi, Server.ethersProvider);
    const transferCalldata = contract.interface.encodeFunctionData('transfer', [toAddress, amount]);

    let ABI = ["function execute(address dest, uint256 value, bytes calldata func)"];
    let iface = new ethers.utils.Interface(ABI);
    return iface.encodeFunctionData("execute", [contractAddress, 0, transferCalldata]);
  }

  async buildTx(contractAddress: string, amount: string, toAddress: string, tokenPaymasterAddress: string, entryPointAddress: string, gasPrice: BigNumber) {
    const senderAddress = Server.account.contractAddress;
    const nonce = await this.contractAccountNonce(senderAddress);
    const initCode = "0x";
    let callData;
    if (contractAddress != null) {
      callData = this.sendERC20TokenCall(contractAddress, toAddress, ETH(amount));
    } else {
      callData = this.sendMainTokenCall(toAddress, ETH(amount));
    }
    // TODO
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

    const params = [senderAddress, nonce, initCode, callData, callGasLimit, verificationGasLimit,
      preVerificationGas, maxFeePerGas, maxPriorityFeePerGas, paymasterAndData, signature];
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
    return await this.getRequest(util.format(Config.MAIN_TOKEN_TX_LIST_API, Server.account.contractAddress));
  }

  async getMainTokenInternalTxList() {
    return await this.getRequest(util.format(Config.MAIN_TOKEN_TX_LIST_INTERNAL_API, Server.account.contractAddress));
  }

  async getTokenTxListByFromAddr(contractAddress: string) {
    return await this.getRequest(util.format(Config.ERC20_TX_FROM_LIST_API, contractAddress, Server.account.contractAddress.substring(2)));
  }

  async getTokenTxListByToAddr(contractAddress: string) {
    return await this.getRequest(util.format(Config.ERC20_TX_TO_LIST_API, contractAddress, Server.account.contractAddress.substring(2)));
  }
}

