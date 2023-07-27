import {ethers} from "ethers";
import {AccountInterface} from "./AccountInterface";
import {EOAManageAccount} from "./EOAManageAccount";

const {arrayify} = require("@ethersproject/bytes");

/**
 * MPC Account Manage
 */
export class MPCManageAccount extends EOAManageAccount implements AccountInterface {

  /**
   * key for sign and get MPC address
   */
  private _key: string;

  constructor() {
    super();
  }

  get key(): string {
    return this._key;
  }

  set key(value: string) {
    this._key = value;
  }

  async initAccount(key: string) {
    console.log("mpc key:", key);
    this._key = key;
    this.ethersWallet = new ethers.Wallet(key, this.ethersProvider);
    this.contractWalletAddress = await this.calcContractWalletAddress();
    this.contractAddressExist = false;
    await super.initAccount(key);
  }

  async getOwnerAddress(): Promise<string> {
    // TODO need to implement
    return "";
  }

  async ownerSign(hash: string): Promise<string> {
    // TODO need to implement
    return await this.ethersWallet.signMessage(arrayify(hash));
  }

}

