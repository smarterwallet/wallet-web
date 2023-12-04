import { ethers } from 'ethers';
import yuxStorage from '../utils/DBUtils';
import { AccountInterface } from './AccountInterface';
import * as mpcWasmUtils from '../js/mpc_wasm_utils.js';
import { JSONBigInt } from '../js/common_utils';
import { Config } from '../config/Config';
import { HttpUtils } from '../utils/HttpUtils';
import { ERC4337BaseManageAccount } from './ERC4337BaseManageAccount';
import { hashMessage, joinSignature } from 'ethers/lib/utils';
import { CryptologyUtils } from '../utils/CryptologyUtils';
import { Global } from '../Global';
import { ab2str, str2ab } from '../utils/TxUtils';

const { arrayify } = require('@ethersproject/bytes');

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

  private _mpcAddress: string;

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

  get mpcAddress(): string {
    return this._mpcAddress;
  }

  set mpcAddress(value: string) {
    this._mpcAddress = value;
  }

  async initAccount(mpcKey: string) {
    this.mpcWasmInstance = await this.generateMPCWasmInstance();

    if (!mpcKey) {
      return;
    }

    console.log('mpc key:', mpcKey);
    await super.initAccount(mpcKey);

    this._mpcKey = mpcKey;
    this.contractWalletAddressSalt = 0;
    this.ethersProvider = new ethers.providers.JsonRpcProvider(Config.RPC_API);
    let account = ethers.Wallet.createRandom();
    this.ethersWallet = new ethers.Wallet(account.privateKey, this.ethersProvider);
    if (mpcKey !== '') {
      console.log('mpc not null');
      const initP1KeyDataRes = await mpcWasmUtils.wasmInitP1KeyData(mpcKey);
      console.log('initP1KeyData: ', initP1KeyDataRes);
      this.contractWalletAddress = await this.calcContractWalletAddress();
      this.deployContractWalletIfNotExist(await this.getOwnerAddress());
    } else {
      console.log('mpc is null');
      this.contractWalletAddress = null;
    }
    this.contractAddressExist = false;
  }

  async getOwnerAddress(): Promise<string> {
    if (Global.authorization == null || Global.authorization === '') {
      console.log('have not login wallet server');
      return null;
    }
    if (this.mpcAddress != null && this.mpcAddress !== '') {
      return this.mpcAddress;
    }
    // get address
    // params: p1 key, p2 id, random prim1, random prim2
    console.log('start to get address');

    console.log('start to get random prim(each client only needs to get it once)');
    let primResult;
    // 从 localStorage 获取数据
    const primKey = 'primResult';
    let data = localStorage.getItem(primKey);
    if (data != null && data !== '') {
      console.log('read prim from local storage');
      primResult = JSON.parse(data);
    } else {
      let primRequestResult = await HttpUtils.get(Config.BACKEND_API + '/mpc/calc/get-prim');
      if (primRequestResult.body['code'] !== 200) {
        throw new Error(primRequestResult.body['message']);
      }
      primResult = primRequestResult.body['result'];
      localStorage.setItem(primKey, JSON.stringify(primResult));
    }
    // console.log("primResult:", primResult);
    const prim1 = primResult['p'];
    const prim2 = primResult['q'];

    const addressGenMessage = await mpcWasmUtils.wasmKeyGenRequestMessage(2, prim1, prim2);
    // console.log("Generate address Request Message: ", addressGenMessage);
    let addressGenMessageJson = JSONBigInt.parse(addressGenMessage);
    console.log(addressGenMessageJson['data']);

    console.log('start to bind-user-p2');
    let bindResult = await HttpUtils.postWithAuth(
      Config.BACKEND_API + '/mpc/calc/bind-user-p2',
      {
        p1_message_dto: addressGenMessageJson['data'],
        p1_data_id: 1,
      },
      Global.authorization,
    );
    if (bindResult.body['code'] !== 200) {
      throw new Error(bindResult.body['message']);
    }
    console.log('bindResult:', bindResult.body);

    // send http request to get address
    console.log('start to get address');
    let getAddressAndPubKeyRes = await HttpUtils.postWithAuth(
      Config.BACKEND_API + '/mpc/calc/get-address',
      {},
      Global.authorization,
    );
    if (getAddressAndPubKeyRes.body['code'] !== 200) {
      throw new Error(getAddressAndPubKeyRes.body['message']);
    }
    const address = getAddressAndPubKeyRes.body['result']['address'];
    const pubKey = getAddressAndPubKeyRes.body['result']['pub_key'];
    console.log('Address: ' + address);
    console.log('PubKey: ' + pubKey);
    mpcWasmUtils.wasmInitPubKey(pubKey);
    // console.log(`initPubKey: ${initPubKeyRes}`);
    this.mpcAddress = address;
    return address;
  }

  async ownerSign(message: string): Promise<string> {
    let hash = hashMessage(arrayify(message));
    hash = hash.substring(2);
    // send http request to get address
    console.log('start to init-p2-content');
    let initP2ContentRes = await HttpUtils.postWithAuth(
      Config.BACKEND_API + '/mpc/calc/init-p2-content',
      {
        message: hash,
      },
      Global.authorization,
    );
    console.log('initP2ContentRes: ', initP2ContentRes);
    if (initP2ContentRes.body['code'] !== 200) {
      throw new Error(initP2ContentRes.body['message']);
    }
    // Step 0
    // params: p1 key, p2 id, random prim1, random prim2
    const initP1ContextRes = await mpcWasmUtils.wasmInitP1Context(hash);
    console.log(`initP1Context: ${initP1ContextRes}`);

    // p1 step1
    const p1Step1Res = await mpcWasmUtils.wasmP1Step1();
    console.log(`p1Step1: ${p1Step1Res}`);

    // p2 step1
    let p2Step1Result = await HttpUtils.postWithAuth(
      Config.BACKEND_API + '/mpc/calc/p2-step1',
      {
        commitment: JSONBigInt.parse(p1Step1Res)['data'],
      },
      Global.authorization,
    );
    console.log('p2Step1Result: ', p2Step1Result);
    if (p2Step1Result.body['code'] !== 200) {
      throw new Error(p2Step1Result.body['message']);
    }

    let proofJson = p2Step1Result.body['result']['proof'];
    console.log('p2Step1Result proofJson: ', proofJson);
    proofJson = mpcWasmUtils.parseNumbers(proofJson);
    console.log('p2Step1Result proofJsonStr: ', JSONBigInt.stringify(proofJson));

    let ecpointJson = p2Step1Result.body['result']['ecpoint'];
    ecpointJson = mpcWasmUtils.parseNumbers(ecpointJson);
    console.log('p2Step1Result ecpointJsonStr: ', JSONBigInt.stringify(ecpointJson));

    // p1 step2
    const p1Step2Res = await mpcWasmUtils.wasmP1Step2(
      JSONBigInt.stringify(proofJson),
      JSONBigInt.stringify(ecpointJson),
    );
    console.log(`p1Step2: ${p1Step2Res}`);

    const p1Step2ResJSON = JSONBigInt.parse(p1Step2Res);
    let p1ProofJson = p1Step2ResJSON['data']['SchnorrProofOutput'];
    p1ProofJson = mpcWasmUtils.parseNumbers(p1ProofJson);
    console.log('p1Step2Res p1ProofJson: ', JSONBigInt.stringify(p1ProofJson));

    let cmtDJson = p1Step2ResJSON['data']['Witness'];
    cmtDJson = mpcWasmUtils.parseNumbers(cmtDJson);
    console.log('p1Step2Res cmtDJson: ', JSONBigInt.stringify(cmtDJson));

    // p2 step2
    let p2Step2Result = await HttpUtils.postWithAuth(
      Config.BACKEND_API + '/mpc/calc/p2-step2',
      {
        cmt_d: cmtDJson,
        p1_proof: p1ProofJson,
      },
      Global.authorization,
    );
    console.log('p2Step2Result: ', p2Step2Result);
    if (p2Step2Result.body['code'] !== 200) {
      throw new Error(p2Step2Result.body['message']);
    }

    // p1 step3
    const p1Step3Res = await mpcWasmUtils.wasmP1Step3(p2Step2Result.body['result'], hash);
    console.log(`p1Step2: ${p1Step3Res}`);

    const signHex = '0x' + JSONBigInt.parse(p1Step3Res)['data']['SignHex'];
    const signForContract = joinSignature(signHex);
    return signForContract;
  }

  private async generateMPCWasmInstance() {
    console.log('generateMPCWasmInstance start');
    const response = await fetch(Config.MPC_WASM_URL);
    let buffer = await response.arrayBuffer();
    // let buffer = null;
    // try {
    //   // @ts-ignore
    //   const bufferStr = (await yuxStorage.getItem('MPC_WASM')) as string;
    //   if (bufferStr) {
    //     buffer = str2ab(bufferStr);
    //   } else {
    //     console.log('no cache of MPC_WASM')
    //   }
    // } catch (e) {
    // }

    // if (buffer == null || buffer.byteLength === 0) {
    //   const response = await fetch(Config.MPC_WASM_URL);
    //   buffer = await response.arrayBuffer();
    //   // @ts-ignore
    //   await yuxStorage.setItem('MPC_WASM', ab2str(buffer));
    // }
    await mpcWasmUtils.initWasm(buffer);
  }

  public async generateKeys() {
    const keysResult = await mpcWasmUtils.wasmGenerateDeviceData();
    const keysJson = JSONBigInt.parse(keysResult);
    if (keysJson['code'] === 200) {
      console.log('p1JsonData: ' + JSONBigInt.stringify(keysJson['data']['p1JsonData']));
      console.log('p2JsonData: ' + JSONBigInt.stringify(keysJson['data']['p2JsonData']));
      console.log('p3JsonData: ' + JSONBigInt.stringify(keysJson['data']['p3JsonData']));
      return keysJson['data'];
    } else {
      console.log('generateDeviceData error. Response: ' + keysResult);
      return null;
    }
  }

  async saveKey2WalletServer(key: string) {
    let api = Config.BACKEND_API + '/mpc/key/save';
    console.log('this._authorization:', Global.authorization);
    return HttpUtils.postWithAuth(
      api,
      {
        key: key,
      },
      Global.authorization,
    );
  }

  saveKey2LocalStorage(key: string, password: string): boolean {
    key = CryptologyUtils.encrypt(key, password);
    localStorage.setItem(Config.LOCAL_STORAGE_MPC_KEY1, key);
    return true;
  }

  saveKeyThirdHash2LocalStorage(key: string, password: string): boolean {
    key = CryptologyUtils.encrypt(key, password);
    localStorage.setItem(Config.LOCAL_STORAGE_MPC_KEY3_HASH, key);
    return true;
  }

  /**
   * save key to ipfs
   * @param key private key
   * @param password from user input
   * @returns result
   */
  async saveKey2DecentralizeStorage(key: string, password: string) {
    key = CryptologyUtils.encrypt(key, password);
    let api = Config.DECENTRALIZE_STORAGE_API + '/ipfs/upload';
    return HttpUtils.post(api, {
      data: key,
    });
  }

  existLocalStorageKey(): boolean {
    return (
      localStorage.getItem(Config.LOCAL_STORAGE_MPC_KEY1) !== null &&
      localStorage.getItem(Config.LOCAL_STORAGE_MPC_KEY1).length !== 0
    );
  }

  getKeyFromLocalStorage(password: string): string {
    const keyInLocal = localStorage.getItem(Config.LOCAL_STORAGE_MPC_KEY1);
    const data = CryptologyUtils.decrypt(keyInLocal, password);
    if (data == null || data === '') {
      return data;
    }
    return mpcWasmUtils.parseNumbers(JSONBigInt.parse(data));
  }

  deleteKeyFromLocalStorage(): void {
    localStorage.removeItem(Config.LOCAL_STORAGE_EOA_KEY);
    localStorage.removeItem(Config.LOCAL_STORAGE_MPC_KEY1);
    localStorage.removeItem(Config.LOCAL_STORAGE_MPC_KEY3_HASH);
  }

  updateLocalKey(password: string): boolean {
    return this.saveKey2LocalStorage(this.key, password);
  }
}
