import {AccountService} from './accountService';
import Web3 from 'web3';
import {ethers} from 'ethers';

// system contract address
export const ADDRESS_SIMPLE_ACCOUNT_FACTORY = "0x6ACF75E7EA53E85fb97ee62575B4410c27346dDE";
export const ADDRESS_TOKEN_PAYMASTER = "0xa83C860681d4da28154c225a985aA0C5a5F7E8ED";
export const ADDRESS_ENTRYPOINT = "0x6FdC82b4500b5B82504DaA465B8CDB9E9dBC48Ef";

// support ERC20 contract address
export const ADDRESS_USDTPM = "0xa83C860681d4da28154c225a985aA0C5a5F7E8ED";

export class Server {
  public static account: AccountService = new AccountService();
  public static initialized: boolean = false;
  public static web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/wXKxRcFDvtVaA2blWEhUT9G2nd3AQ0A_');
  public static ethersProvider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/wXKxRcFDvtVaA2blWEhUT9G2nd3AQ0A_');

  public static async init() {
    Server.initialized = true;
  }

  public static async checkTransactionStatus(txHash: string) {
    console.log("check tx on chain. tx hash: " + txHash);
    let receipt = await Server.ethersProvider.getTransactionReceipt(txHash);

    while (!receipt) {
      await Server.ethersProvider.waitForTransaction(txHash);
      receipt = await Server.ethersProvider.getTransactionReceipt(txHash);
    }

    console.log('tx has been on chain. tx hash:', receipt);
  }

}
