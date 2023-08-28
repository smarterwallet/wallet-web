import { EOAManageAccount } from './account/EOAManageAccount';
import { AccountInterface } from "./account/AccountInterface";
import { MPCManageAccount } from "./account/MPCManageAccount";

export class Global {
  private static _accountType: number;

  public static account: AccountInterface;
  public static initialized: boolean = false;

  public static tempLocalPassword: string;

  public static async changeAccountType(accountType: number) {
    this._accountType = accountType;
    await this.init();
  }

  public static async init() {
    this.initialized = true;
    switch (this._accountType) {
      case 1:
      default:
        console.log("init EOA account type");
        this.account = new EOAManageAccount()
        break;
      case 2:
        console.log("init MPC account type");
        this.account = new MPCManageAccount()
        break;
    }
    if (this.account == null || Global.account.initData == null) {
      // init
      console.log("Global init");
      await this.account.initAccount(null);
    } else {
      // flush
      console.log("Global flush");
      await this.account.initAccount(Global.account.initData);
      this.account.isLoggedIn = true;
    }
  }

}
