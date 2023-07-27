import {ethers} from "ethers";
import {AccountInterface} from "./AccountInterface";
import {ERC4337BaseManageAccount} from "./ERC4337BaseManageAccount";
import {Config} from "../config/Config";

const {arrayify} = require("@ethersproject/bytes");

/**
 * Account Manage
 */
export class EOAManageAccount extends ERC4337BaseManageAccount implements AccountInterface {

  /**
   * EOA address key for sign and manage wallet
   */
  private _eoaKey: string;

  constructor() {
    super();
    console.log("EOAManageAccount init");
  }

  get eoaKey(): string {
    return this._eoaKey;
  }

  set eoaKey(value: string) {
    this._eoaKey = value;
  }

  async initAccount(eoaKey: string) {
    this.eoaKey = eoaKey;
    this.contractWalletAddressSalt = 0;
    this.ethersProvider = new ethers.providers.JsonRpcProvider(Config.RPC_API);
    if (eoaKey != null && eoaKey !== "") {
      console.log("eoaKey not null");
      console.log("eoaKey:", eoaKey);
      this.ethersWallet = new ethers.Wallet(eoaKey, this.ethersProvider);
      this.contractWalletAddress = await this.calcContractWalletAddress();
    } else {
      console.log("eoakey is null")
      this.ethersWallet = null;
      this.contractWalletAddress = null;
    }
    this.contractAddressExist = false;

    await super.initAccount(eoaKey);
  }

  async getOwnerAddress(): Promise<string> {
    return await this.ethersWallet.getAddress();
  }

  async getOwnerAddressNonce(): Promise<number> {
    return await this.ethersWallet.getTransactionCount(await this.getOwnerAddress());
  }

  async ownerSign(hash: string): Promise<string> {
    return await this.ethersWallet.signMessage(arrayify(hash));
  }

}
