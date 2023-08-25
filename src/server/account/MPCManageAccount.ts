import { ethers } from "ethers";
import { AccountInterface } from "./AccountInterface";
import { EOAManageAccount } from "./EOAManageAccount";
import * as mpcWasmUtils from '../js/mpc_wasm_utils.js';
import { JSONBigInt } from "../js/common_utils";
import { Config } from "../config/Config";
import { HttpUtils } from "../utils/HttpUtils";
import { ERC4337BaseManageAccount } from "./ERC4337BaseManageAccount";

const { arrayify } = require("@ethersproject/bytes");

/**
 * MPC Account Manage
 */
export class MPCManageAccount extends ERC4337BaseManageAccount implements AccountInterface {

  /**
   * key for sign and get MPC address
   */
  private _mpcKey: string;

  /**
   * wasm instance
   */
  private _mpcWasmInstance: any;

  private _authorization: string;

  constructor() {
    super();
  }

  get key(): string {
    return this._mpcKey;
  }

  set key(value: string) {
    this._mpcKey = value;
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

  async initAccount(mpcKey: string) {
    // TODO only for test
    mpcKey = "{\"Id\":1,\"ShareI\":217846336608636814869730242691162623428602750849327859885486059440886707396967,\"PublicKey\":{\"Curve\":\"secp256k1\",\"X\":21813151983507503395302029099618182021145901011013099920572583206125558516758,\"Y\":49671425612481876155282918131354433515159845133152098589877317033648352777306},\"ChainCode\":\"8700298ba02dc4399722ee5780b6c8941f6031de3788b6bd69d529e9ec5d25de\",\"SharePubKeyMap\":{\"1\":{\"Curve\":\"secp256k1\",\"X\":72028570987944934025156373151523167380442519718362391580784617155013272187769,\"Y\":93688287248850657301208517895383787722033271638455717634452870193797992290602},\"2\":{\"Curve\":\"secp256k1\",\"X\":60843502703945476734713204655662180964958429379404842990456662320579017070952,\"Y\":87483069748555958504231705641021186473714992537449899429345728572632959317890},\"3\":{\"Curve\":\"secp256k1\",\"X\":46261205405204336553406740356964276639162145646919877661047679199346115145801,\"Y\":110010455857167350971875975047238195426068498783803218741316697224349730843919}}}";

    console.log("mpc key:", mpcKey);

    let account = ethers.Wallet.createRandom();
    await super.initAccount(account.privateKey);

    this._authorization = "local"

    this.mpcWasmInstance = await this.generateMPCWasmInstance();

    this.initData = mpcKey;
    this._mpcKey = mpcKey;
    this.contractWalletAddressSalt = 0;
    this.ethersProvider = new ethers.providers.JsonRpcProvider(Config.RPC_API);
    if (mpcKey != null && mpcKey !== "") {
      console.log("eoaKey not null");
      const initP1KeyDataRes = await mpcWasmUtils.wasmInitP1KeyData(mpcKey);
      console.log("initP1KeyData: ", initP1KeyDataRes);
      this.contractWalletAddress = await this.calcContractWalletAddress();
    } else {
      console.log("eoakey is null")
      this.contractWalletAddress = null;
    }
    this.contractAddressExist = false;

    // TEST
    this.ownerSign("1635b3221c01a44dca3775217a1862c5f8df5d214aadfd6e8c0f6471ca28cd75");
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

    let primResult;
    // 从 localStorage 获取数据
    const primKey = "primResult";
    let data = localStorage.getItem(primKey);
    if (data !== null) {
      console.log("read prim from local storage");
      primResult = JSON.parse(data);
    } else {
      let primRequestResult = await HttpUtils.get(Config.BACKEND_API + "/mpc/calc/random-prim");
      primResult = primRequestResult.body["result"];
      localStorage.setItem(primKey, JSON.stringify(primResult));
    }
    // console.log("primResult:", primResult);
    const prim1 = primResult["p"];
    const prim2 = primResult["q"];

    const addressGenMessage = await mpcWasmUtils.wasmKeyGenRequestMessage(2, prim1, prim2);
    // console.log("Generate address Request Message: ", addressGenMessage);
    let addressGenMessageJson = JSONBigInt.parse(addressGenMessage);
    console.log(addressGenMessageJson["data"]);

    console.log("start to bind-user-p2")
    let bindResult = await HttpUtils.post(Config.BACKEND_API + "/mpc/calc/bind-user-p2", {
      "Authorization": this._authorization,
      "p1_message_dto": addressGenMessageJson["data"],
      "p1_data_id": 1,
    });
    console.log("bindResult:", bindResult.body);

    // send http request to get address
    console.log("start to get address")
    let getAddressAndPubKeyRes = await HttpUtils.post(Config.BACKEND_API + "/mpc/calc/get-address", {
      "Authorization": this._authorization,
    })
    const address = getAddressAndPubKeyRes.body["result"]["address"];
    const pubKey = getAddressAndPubKeyRes.body["result"]["pub_key"];
    console.log("Address: " + address);
    console.log("PubKey: " + pubKey);
    const initPubKeyRes = mpcWasmUtils.wasmInitPubKey(pubKey);
    console.log(`initPubKey: ${initPubKeyRes}`);
    return address;
  }

  async ownerSign(message: string): Promise<string> {
    // TODO message is hex str. how to handle it? need check signature with golang code.
    // send http request to get address
    console.log("start to init-p2-content")
    let initP2ContentRes = await HttpUtils.post(Config.BACKEND_API + "/mpc/calc/init-p2-content", {
      "Authorization": this._authorization,
      "message": message
    })
    console.log("initP2ContentRes: ", initP2ContentRes);
    // Step 0
    // params: p1 key, p2 id, random prim1, random prim2
    const initP1ContextRes = await mpcWasmUtils.wasmInitP1Context(message);
    console.log(`initP1Context: ${initP1ContextRes}`);

    // p1 step1
    const p1Step1Res = await mpcWasmUtils.wasmP1Step1();
    console.log(`p1Step1: ${p1Step1Res}`);

    // p2 step1
    let p2Step1Result = await HttpUtils.post(Config.BACKEND_API + "/mpc/calc/p2-step1", {
      "Authorization": this._authorization,
      "commitment": JSONBigInt.parse(p1Step1Res)["data"],
    })
    console.log("p2Step1Result: ", p2Step1Result);

    let proofJson = p2Step1Result.body["result"]["proof"]
    console.log("p2Step1Result proofJson: ", proofJson);
    proofJson = mpcWasmUtils.parseNumbers(proofJson)
    console.log("p2Step1Result proofJsonStr: ", JSONBigInt.stringify(proofJson));

    let ecpointJson = p2Step1Result.body["result"]["ecpoint"]
    ecpointJson = mpcWasmUtils.parseNumbers(ecpointJson)
    console.log("p2Step1Result ecpointJsonStr: ", JSONBigInt.stringify(ecpointJson));

    // p1 step2
    const p1Step2Res = await mpcWasmUtils.wasmP1Step2(JSONBigInt.stringify(proofJson), JSONBigInt.stringify(ecpointJson));
    console.log(`p1Step2: ${p1Step2Res}`);

    const p1Step2ResJSON = JSONBigInt.parse(p1Step2Res)
    let p1ProofJson = p1Step2ResJSON["data"]["SchnorrProofOutput"]
    p1ProofJson = mpcWasmUtils.parseNumbers(p1ProofJson)
    console.log("p1Step2Res p1ProofJson: ", JSONBigInt.stringify(p1ProofJson));

    let cmtDJson = p1Step2ResJSON["data"]["Witness"]
    cmtDJson = mpcWasmUtils.parseNumbers(cmtDJson)
    console.log("p1Step2Res cmtDJson: ", JSONBigInt.stringify(cmtDJson));

    // p2 step2
    let p2Step2Result = await HttpUtils.post(Config.BACKEND_API + "/mpc/calc/p2-step2", {
      "Authorization": this._authorization,
      "cmt_d": cmtDJson,
      "p1_proof": p1ProofJson,
    })
    console.log("p2Step2Result: ", p2Step2Result);

    // p1 step3
    const p1Step3Res = await mpcWasmUtils.wasmP1Step3(p2Step2Result.body["result"], message);
    console.log(`p1Step2: ${p1Step3Res}`);

    console.log("\n>>> Sign hex string: " + JSONBigInt.parse(p1Step3Res)["data"]["SignHex"]);

    return JSONBigInt.parse(p1Step3Res)["data"]["SignHex"];
  }

  private bufferToBase64(buf: ArrayBuffer) {
    const uint8 = new Uint8Array(buf);
    let str = '';
    for (let i = 0; i < uint8.byteLength; i++) {
      str += String.fromCharCode(uint8[i]);
    }
    return btoa(str);
  }

  private base64ToBuffer(base64: string) {
    const binstr = atob(base64);
    let buf = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
      buf[i] = ch.charCodeAt(0);
    });
    return buf.buffer;
  }

  private async generateMPCWasmInstance() {
    console.log("generateMPCWasmInstance start");
    const response = await fetch(this.commonConfig.mpc.wasm.url);
    const buffer = await response.arrayBuffer();
    await mpcWasmUtils.initWasm(buffer);
  }

  private async generateKeys() {
    const keysResult = await mpcWasmUtils.wasmGenerateDeviceData();
    const keysJson = JSONBigInt.parse(keysResult);
    if (keysJson["code"] === 200) {
      console.log("p1JsonData: " + JSONBigInt.stringify(keysJson["data"]["p1JsonData"]));
      console.log("p2JsonData: " + JSONBigInt.stringify(keysJson["data"]["p2JsonData"]));
      console.log("p3JsonData: " + JSONBigInt.stringify(keysJson["data"]["p3JsonData"]));
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

