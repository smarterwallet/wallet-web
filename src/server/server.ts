import {Account} from './account';
import {ethers} from 'ethers';
import {Config} from "./config";

export class Server {
  public static isLoggedIn: boolean = false;
  public static account: Account = new Account();
  public static initialized: boolean = false;
  public static ethersProvider: ethers.providers.JsonRpcProvider;

  public static async init() {
    Server.initialized = true;
    await this.flush();
  }

  public static async checkTransactionStatus(txHash: string) {
    let receipt = await Server.ethersProvider.getTransactionReceipt(txHash);

    while (!receipt) {
      await Server.ethersProvider.waitForTransaction(txHash);
      receipt = await Server.ethersProvider.getTransactionReceipt(txHash);
    }
  }

  public static async flush() {
    this.ethersProvider = new ethers.providers.JsonRpcProvider(Config.RPC_API);
    await this.account.flushEtherWallet();

    // 如果没有创建合约，那么需要创建合约账户
    await this.account.deployContractAddressIfNot();
  }

}
