import {ethers} from "ethers";
import {AccountInterface} from "./AccountInterface";
import {EOAManageAccount} from "./EOAManageAccount";
import * as mpcWasmUtils from '../js/mpc_wasm_utils.js';
import {Config} from "../config/Config";
import {HttpUtils} from "../utils/HttpUtils";

const {arrayify} = require("@ethersproject/bytes");

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

  private _authorization: string;

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

  get authorization(): string {
    return this._authorization;
  }

  set authorization(value: string) {
    this._authorization = value;
  }

  async initAccount(key: string) {
    console.log("mpc key:", key);
    await super.initAccount(key);

    this._key = key;
    const initP1KeyDataRes = mpcWasmUtils.wasmInitP1KeyData(key);
    console.log("initP1KeyData: ", initP1KeyDataRes);
    let account = ethers.Wallet.createRandom();
    this.ethersWallet = new ethers.Wallet(account.privateKey, this.ethersProvider);
    this.mpcWasmInstance = await this.generateMPCWasmInstance();
    this.contractWalletAddress = await this.calcContractWalletAddress();
    this.contractAddressExist = false;
  }

  async getOwnerAddress(): Promise<string> {
    if (!this._authorization) {
      console.log("have not login wallet server");
      return null;
    }
    // get address
    // params: p1 key, p2 id, random prim1, random prim2
    console.log("start to get address")
    console.log("start to get random prim(each client only needs to get it once)")
    let primResult = await HttpUtils.get(Config.BACKEND_API + "/random-prim");
    console.log("primResult:", primResult.body["result"]);

    const prim1 = primResult.body["result"]["p"];
    const prim2 = primResult.body["result"]["q"];
    const addressGenMessage = mpcWasmUtils.wasmKeyGenRequestMessage(2, prim1, prim2);
    console.log("Generate address Request Message: ", addressGenMessage);
    let addressGenMessageJson = mpcWasmUtils.JSONBigInt.parse(addressGenMessage);
    console.log(addressGenMessageJson["data"]);

    console.log("start to bind-user-p2")
    let bindResult = await HttpUtils.post(Config.BACKEND_API + "/bind-user-p2", {
      "Authorization": this._authorization,
      "p1_message_dto": addressGenMessageJson["data"],
      "p1_data_id": 1,
    });
    console.log("bindResult:", bindResult.body);

    // send http request to get address
    console.log("start to get address")
    let getAddressAndPubKeyRes = await HttpUtils.post(Config.BACKEND_API + "/get-address", {
      "Authorization": this._authorization,
    })
    const address = getAddressAndPubKeyRes.body["result"]["address"];
    const pubKey = getAddressAndPubKeyRes.body["result"]["pub_key"];
    console.log("Address: " + address);
    console.log("PubKey: " + pubKey);
    return address;
  }

  async ownerSign(hash: string): Promise<string> {
    // TODO need to implement
    return await this.ethersWallet.signMessage(arrayify(hash));
  }

  private async generateMPCWasmInstance() {
    console.log("generateMPCWasmInstance start");
    const response = await fetch(this.commonConfig.mpc.wasm.url);
    const buffer = await response.arrayBuffer();
    await mpcWasmUtils.initWasm(buffer);

    await this.generateKeys();
  }

  private async generateKeys() {
    const keysResult = await mpcWasmUtils.wasmGenerateDeviceData();
    const keysJson = mpcWasmUtils.JSONBigInt.parse(keysResult);
    if (keysJson["code"] === 200) {
      console.log("p1JsonData: " + mpcWasmUtils.JSONBigInt.stringify(keysJson["data"]["p1JsonData"]));
      console.log("p2JsonData: " + mpcWasmUtils.JSONBigInt.stringify(keysJson["data"]["p2JsonData"]));
      console.log("p3JsonData: " + mpcWasmUtils.JSONBigInt.stringify(keysJson["data"]["p3JsonData"]));
    } else {
      console.log("generateDeviceData error. Response: " + keysResult);
    }
    console.log("generateMPCWasmInstance end");
  }

  public async saveKey2WalletServer(key: string) {
    let api = Config.BACKEND_API + '/mpc/key/save';
    return await HttpUtils.post(api, {
      "Authorization": this._authorization,
      "key": key
    });
  }

}

