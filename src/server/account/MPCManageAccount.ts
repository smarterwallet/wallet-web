import {ethers} from "ethers";
import {AccountInterface} from "./AccountInterface";
import {EOAManageAccount} from "./EOAManageAccount";

const {arrayify} = require("@ethersproject/bytes");
import * as myModule from '../js/MPCUtils.js';

/**
 * MPC Account Manage
 */
export class MPCManageAccount extends EOAManageAccount implements AccountInterface {

  /**
   * key for sign and get MPC address
   */
  private _key: string;

  /**
   * wasm instance
   */
  private _mpcWasmInstance: any;

  constructor() {
    super();
  }

  get key(): string {
    return this._key;
  }

  set key(value: string) {
    this._key = value;
  }

  get mpcWasmInstance(): any {
    return this._mpcWasmInstance;
  }

  set mpcWasmInstance(value: any) {
    this._mpcWasmInstance = value;
  }

  async initAccount(key: string) {
    console.log("mpc key:", key);
    await super.initAccount(key);

    this._key = key;
    let account = ethers.Wallet.createRandom();
    this.ethersWallet = new ethers.Wallet(account.privateKey, this.ethersProvider);
    this.mpcWasmInstance = await this.generateMPCWasmInstance();
    this.contractWalletAddress = await this.calcContractWalletAddress();
    this.contractAddressExist = false;
  }

  async getOwnerAddress(): Promise<string> {
    const result = this.mpcWasmInstance.exports.add(1,2);
    console.log(result);
    return "";
  }

  async ownerSign(hash: string): Promise<string> {
    // TODO need to implement
    return await this.ethersWallet.signMessage(arrayify(hash));
  }

  private async generateMPCWasmInstance() {
    console.log("generateMPCWasmInstance");
    const response = await fetch(this.commonConfig.mpc.wasm.url);
    const buffer = await response.arrayBuffer();
    myModule.test1(buffer);
    // const response = await fetch(this.commonConfig.mpc.wasm.url);
    // const buffer = await response.arrayBuffer();
    // const module = await WebAssembly.compile(buffer);
    //
    // let imports = {
    //   env: {}
    // };
    // imports.env = imports.env || {}
    //
    // Object.assign(imports.env, {
    //   tableBase: module.tableBase,
    //   table: new WebAssembly.Table({
    //     initial: 4,
    //     element: 'anyfunc',
    //   }),
    //   print:function(msg: any){
    //     console.log(msg);
    //   }
    // });
    // return await WebAssembly.instantiate(module, imports);
  }

}

