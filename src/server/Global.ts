import { EOAManageAccount } from './account/EOAManageAccount';
import { AccountInterface } from './account/AccountInterface';
import { MPCManageAccount } from './account/MPCManageAccount';
import { Config } from './config/Config';

export class Global {
  private static _accountType: number;

  public static account: AccountInterface;
  public static initialized: boolean = false;

  public static tempLocalPassword: string;

  public static messageTypeKeyLoading = 'loading';

  public static authorization: string;

  public static accountType(): number {
    return Global._accountType;
  }

  public static async changeAccountType(accountType: number) {
    // if change account type, need set pre object to null
    if (accountType !== this._accountType && this.account) {
      this.account = null;
    }
    this._accountType = accountType;
    await this.init();
  }

  public static async init() {
    let initData = null;

    if (this.account) {
      initData = this.account.initData;
    }
    this.initialized = true;
    switch (this._accountType) {
      case 1:
      default:
        console.log('init EOA account type');
        this.account = new EOAManageAccount();
        break;
      case 2:
        console.log('init MPC account type');
        this.account = new MPCManageAccount();
        break;
    }
    this.account.initAccount(initData);
  }

  public static isMPCAccount() {
    return (
      localStorage.getItem(Config.LOCAL_STORAGE_MPC_KEY1) !== null &&
      localStorage.getItem(Config.LOCAL_STORAGE_MPC_KEY1).length !== 0
    );
  }
}
