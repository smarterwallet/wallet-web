import { Server } from './server';
import { Service, ServiceResponse } from './service';

const factoryAbi = require('../data/factoryAbi.json');
const usdtpmAbi  = require('../data/usdtpmAbi.json');

export class AccountService extends Service {
  constructor() {
    super();
  }

  isLoggedIn() {
    if(localStorage.getItem('isLoggedIn') === '1')
      return true;
    return false;
  }

  async createAccount(params:any) {
    let api = 'https://smarter-api.web3-idea.xyz/be/account/onchain/create';
    let response = await this.sendCommand(api, params);
    console.log("createAccount response:", response);
    return response;
  }

  async getAddress(eoaAddress: string, salt: number) {
    let contract = new Server.web3.eth.Contract(factoryAbi, '0xD640F8f864a212CfDd8FE8B9Fdfb69d24f09b65e');
    
    try {
      let address = await contract.methods.getAddress(eoaAddress, salt).call();
      return address;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async balanceOfMATIC(address: string) {
    const balance = await Server.web3.eth.getBalance(address);
    return Server.web3.utils.fromWei(balance);
  }

  async balanceOfUSDTPM(address: string) {
    let contract = new Server.web3.eth.Contract(usdtpmAbi, '0xa4baa71e173Ef63250fB1D9a1FE1467f722B19C7');
    
    try {
      let balance = await contract.methods.balanceOf(address).call();
      return Server.web3.utils.fromWei(balance);
    } catch (error) {
      console.error(error);
      return '';
    }
  }
}

