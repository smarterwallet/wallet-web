import {AccountService} from './accountService';
import Web3 from 'web3';
import {ethers} from 'ethers';


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
