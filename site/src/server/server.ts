import {AccountService} from './accountService';
import Web3 from 'web3';
import {ethers} from 'ethers';

// system contract address
export const ADDRESS_SIMPLE_ACCOUNT_FACTORY = "0x6ACF75E7EA53E85fb97ee62575B4410c27346dDE";
export const ADDRESS_TOKEN_PAYMASTER = "0xa83C860681d4da28154c225a985aA0C5a5F7E8ED";
export const ADDRESS_ENTRYPOINT = "0x6FdC82b4500b5B82504DaA465B8CDB9E9dBC48Ef";

// support ERC20 contract address
export const ADDRESS_USDTPM = "0xa83C860681d4da28154c225a985aA0C5a5F7E8ED";

export const MATIC_TX_LIST_API = "https://api-testnet.polygonscan.com/api?module=account&action=txlistinternal&startblock=0&endblock=99999999&sort=desc&apikey=9Q18WP56QKIDJWZQDGMC4QZE8AJQXJM3Z8&address=";
export const ERC20_TX_FROM_LIST_API = "https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&address=" + ADDRESS_USDTPM + "&startblock=0&endblock=99999999&sort=desc&apikey=9Q18WP56QKIDJWZQDGMC4QZE8AJQXJM3Z8&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_1_opr=and&topic1=0x000000000000000000000000";
export const ERC20_TX_TO_LIST_API = "https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&address=" + ADDRESS_USDTPM + "&startblock=0&endblock=99999999&sort=desc&apikey=9Q18WP56QKIDJWZQDGMC4QZE8AJQXJM3Z8&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_1_opr=and&topic2=0x000000000000000000000000";

// export const BUNDLER_API = "http://127.0.0.1:4337";

export const BUNDLER_API = "https://smarter-api.web3-idea.xyz/bundler/";

export class Server {
  public static isLoggedIn: boolean = false;
  public static account: AccountService = new AccountService();
  public static initialized: boolean = false;
  public static web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/wXKxRcFDvtVaA2blWEhUT9G2nd3AQ0A_');
  public static ethersProvider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/wXKxRcFDvtVaA2blWEhUT9G2nd3AQ0A_');

  public static async init() {
    Server.initialized = true;
  }

  public static async checkTransactionStatus(txHash: string) {
    let receipt = await Server.ethersProvider.getTransactionReceipt(txHash);

    while (!receipt) {
      await Server.ethersProvider.waitForTransaction(txHash);
      receipt = await Server.ethersProvider.getTransactionReceipt(txHash);
    }
  }

}
