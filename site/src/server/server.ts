import { AccountService } from './accountService';
import { Service, ServiceResponse } from './service';
import { publish } from '../app/util/event';
import Web3 from 'web3';

export class Server {
  public static account: AccountService = new AccountService();
  public static initialized: boolean = false;
  public static web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/wXKxRcFDvtVaA2blWEhUT9G2nd3AQ0A_');

  public static async init() {
    Server.initialized = true;
  }

}
