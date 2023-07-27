import {EOAManageAccount} from './account/EOAManageAccount';
import {AccountInterface} from "./account/AccountInterface";

export class Global {
  public static account: AccountInterface;
  public static initialized: boolean = false;

  public static async init() {
    this.initialized = true;
    if (this.account == null || Global.account.initData == null) {
      // init
      console.log("Global init");
      this.account = new EOAManageAccount();
      await this.account.initAccount(null);
    } else {
      // flush
      console.log("Global flush");
      console.log("initdata:", Global.account.initData);
      await this.account.initAccount(Global.account.initData);
      await this.account.deployContractWalletIfNotExist(this.account.contractWalletAddress);
      this.account.isLoggedIn = true;
    }
  }

}
