import {EOAManageAccount} from './account/EOAManageAccount';
import {ethers} from 'ethers';
import {Config} from "./config/Config";

export class Global {
  public static account: EOAManageAccount;
  public static initialized: boolean = false;
  public static ethersProvider: ethers.providers.JsonRpcProvider;

  public static async init() {
    this.initialized = true;
    this.account = new EOAManageAccount();
    await this.flush();
  }

  public static async flush() {
    console.log("server flush");
    this.ethersProvider = new ethers.providers.JsonRpcProvider(Config.RPC_API);
    await this.account.flushEtherWallet();

    // 如果没有创建合约，那么需要创建合约账户
    await this.account.deployContractAddressIfNot(await this.account.ethersWallet.getAddress());
  }

}
