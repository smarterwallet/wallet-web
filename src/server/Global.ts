import {EOAManageAccount} from './account/EOAManageAccount';
import {AccountInterface} from "./account/AccountInterface";
import {MPCManageAccount} from "./account/MPCManageAccount";

export class Global {
  private static _accountType: number;

  public static account: AccountInterface;
  public static initialized: boolean = false;

  public static async changeAccountType(accountType: number) {
    this._accountType = accountType;
  }

  public static async init() {
    this.initialized = true;
    if (this.account == null || Global.account.initData == null) {
      // init
      console.log("Global init");
      switch (this._accountType) {
        case 1:
        default:
          this.account = new EOAManageAccount()
          break;
          // default:
        case 2:
          this.account = new MPCManageAccount()
          break;
      }
      await this.account.initAccount(null);
    } else {
      // flush
      console.log("Global flush");
      await this.account.initAccount(Global.account.initData);
      await this.account.deployContractWalletIfNotExist(this.account.contractWalletAddress);
      this.account.isLoggedIn = true;
    }
  }

}
