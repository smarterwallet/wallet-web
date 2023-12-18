import { Global } from '../Global';

const commonConfig = require('../../app/config/common.json');

export interface Asset {
  name: string;
  address: string | null;
  type: number;
  icon: string;
  sort: number;
  decimals: number;
}

class Assets {
  [key: string]: Asset;
}

export class Config {
  public static ADDRESS_SIMPLE_ACCOUNT_FACTORY: string;
  public static ADDRESS_TOKEN_PAYMASTER: string;
  public static ADDRESS_ENTRYPOINT: string;
  public static ADDRESS_AUTO_TRADING: string;
  public static MAIN_TOKEN_TX_LIST_API: string;
  public static MAIN_TOKEN_TX_LIST_INTERNAL_API: string;
  public static ERC20_TX_FROM_LIST_API: string;
  public static ERC20_TX_TO_LIST_API: string;
  public static BUNDLER_API: string;
  public static RPC_API: string;
  public static BACKEND_API: string;
  public static AUTO_TRADING_API: string;
  public static DECENTRALIZE_STORAGE_API: string;
  public static BLOCKCHAIN_SCAN: string;
  public static TOKENS: Assets;
  public static MPC_WASM_URL: string;

  // 启动默认网络
  public static DEFAULT_NETWORK = 'Mumbai';
  // public static DEFAULT_NETWORK = "Polygon";
  public static TOKEN_PAYMASTER_TOKEN_NAME = 'USDC';
  public static LOCAL_STORAGE_EOA_KEY = 'smarter-wallet-eoa-key-v01';
  public static LOCAL_STORAGE_MPC_KEY1 = 'smarter-wallet-mpc-key1-v01';
  public static LOCAL_STORAGE_MPC_KEY3_HASH = 'smarter-wallet-mpc-key3-hash-v01';

  public static CURRENT_CHAIN_NAME = this.DEFAULT_NETWORK;

  public static async init(rawData: string) {
    const commonConfigJSON = JSON.parse(JSON.stringify(commonConfig));
    this.MPC_WASM_URL = commonConfigJSON.mpc.wasm.url;
    this.DECENTRALIZE_STORAGE_API = commonConfigJSON.storage.decentralize_storage_api;
    await this.flush(rawData);
  }

  // 切换网络时调用
  private static async flush(rawData: string) {
    console.log('config flush. Data:', rawData);

    const configData = JSON.parse(rawData);
    this.ADDRESS_SIMPLE_ACCOUNT_FACTORY = configData.address.address_simple_account_factory;
    this.ADDRESS_TOKEN_PAYMASTER = configData.address.address_token_paymaster;
    this.ADDRESS_ENTRYPOINT = configData.address.address_entrypoint;
    this.ADDRESS_AUTO_TRADING = configData.address.address_auto_trading;
    this.MAIN_TOKEN_TX_LIST_API = configData.api.matic_tx_list_api;
    this.MAIN_TOKEN_TX_LIST_INTERNAL_API = configData.api.matic_tx_list_internal_api;
    this.ERC20_TX_FROM_LIST_API = configData.api.erc20_tx_from_list_api;
    this.ERC20_TX_TO_LIST_API = configData.api.erc20_tx_to_list_api;
    this.BUNDLER_API = configData.api.bundler_api;
    this.RPC_API = configData.api.rpc_api;
    this.BACKEND_API = configData.api.backend_api;
    this.AUTO_TRADING_API = configData.api.auto_trading_api;
    this.BLOCKCHAIN_SCAN = configData.api.blockchain_scan;
    this.TOKENS = configData.token;
  }
}
