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
    public static MAIN_TOKEN_TX_LIST_API: string;
    public static MAIN_TOKEN_TX_LIST_INTERNAL_API: string;
    public static ERC20_TX_FROM_LIST_API: string;
    public static ERC20_TX_TO_LIST_API: string;
    public static BUNDLER_API: string;
    public static RPC_API: string;
    public static BACKEND_API: string;
    public static BLOCKCHAIN_SCAN: string;
    public static TOKENS: Assets;

    // 启动默认网络
    public static DEFAULT_NETWORK = "Polygon";
    public static TOKEN_PAYMASTER_TOKEN_NAME = "SWT";

    public static CURRENT_CHAIN_NAME = this.DEFAULT_NETWORK;

    public static async init(rawData: string) {
        await this.flush(rawData);
    }

    // 切换网络时调用
    public static async flush(rawData: string) {
        console.log("config flush. Data:", rawData);

        const configData = JSON.parse(rawData);
        this.ADDRESS_SIMPLE_ACCOUNT_FACTORY = configData.address.address_simple_account_factory;
        this.ADDRESS_TOKEN_PAYMASTER = configData.address.address_token_paymaster;
        this.ADDRESS_ENTRYPOINT = configData.address.address_entrypoint;
        this.MAIN_TOKEN_TX_LIST_API = configData.api.matic_tx_list_api;
        this.MAIN_TOKEN_TX_LIST_INTERNAL_API = configData.api.matic_tx_list_internal_api;
        this.ERC20_TX_FROM_LIST_API = configData.api.erc20_tx_from_list_api;
        this.ERC20_TX_TO_LIST_API = configData.api.erc20_tx_to_list_api;
        this.BUNDLER_API = configData.api.bundler_api;
        this.RPC_API = configData.api.rpc_api;
        this.BACKEND_API = configData.api.backend_api;
        this.BLOCKCHAIN_SCAN = configData.api.blockchain_scan;
        this.TOKENS = configData.token;
    }
}
