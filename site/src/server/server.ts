import { AccountService } from './accountService';
import { Service, ServiceResponse } from './service';
import { PublicService } from './publicService';
import { publish } from '../app/util/event';

export class Server {
  public static account: AccountService = new AccountService();
  public static public: PublicService = new PublicService();
  public static initialized: boolean = false;
  
  protected static signUpDetails: any = null;
  
  // Objects of Google Sheet
  public static async init() {
    // let promises = [];
    // promises.push(Server.database.init());
    // promises.push(Server.user.init());
    // promises.push(Server.games.init());
    // promises.push(Server.shop.init());
    // promises.push(Server.messages.init());

    // let responses = await Promise.all(promises);

    // for(let i = 0; i < responses.length; i++)
    //   if(!responses[i].success)
    //     return responses[i];

    // await this.autoLogin();
    
    // load objects of Google Sheet

    await this.initProvider();

    // if (Server.account.isLoggedIn())
    //   await Server.user.sync();

    Server.initialized = true;
  }

  protected static async initProvider() {
    // const projectId = process.env.REACT_APP_WC_PRJ_ID;
    // this.provider  = await EthereumProvider.init({
    //   projectId: projectId,
    //   chains: [5, 1], // mainnet, goerli testnet
    //   showQrModal: true
    // });

    // this.web3 = new Web3(this.provider);

    // this.provider.on("chainChanged", (chainId) => {
    //   console.log("chainChanged:", chainId);
    // });

    // provider.on("connect", (accounts) => {
    //   console.log("WC connect:", accounts);
    // });

    // this.provider.on("disconnect", (accounts) => {
    //   console.log("disconnect:", accounts);
    //   publish('wallet-events');
    // });

    // this.provider.on("accountsChanged", (accounts) => {
    //   console.log("accountsChanged:", accounts);
    //   publish('wallet-events');
    // });
  }

  // public static async startSignUp(email: string, password: string): Promise<ServiceResponse> {
  //   let response = await Server.account.signUp(email, password);
  //   this.signUpDetails = response.success ? {email, password} : null;
  //   return response;
  // }

  // public static async completeSignUp(code: string): Promise<ServiceResponse> {
  //   let response = await Server.account.confirmRegistration(code);
  //   if(response.success)
  //     await this.login(this.signUpDetails.email, this.signUpDetails.password);
  //   return response;
  // }

  // public static async login(email: string, password: string): Promise<ServiceResponse> {
  //   let response = await Server.account.authenticate(email, password);
  //   if(!response.success)
  //     return response;

  //   let refreshToken = Server.account.getRefreshToken();
  //   window.localStorage.setItem('RefreshToken', refreshToken);
  //   window.localStorage.setItem('RefreshEmail', email);

  //   return Server.finishLogin();
  // }

  // public static async autoLogin(): Promise<ServiceResponse> {
  //   let email = window.localStorage.getItem('RefreshEmail');
  //   let token = window.localStorage.getItem('RefreshToken');

  //   if(!email || !token)
  //     return {success: false};

  //   let response = await Server.account.authenticateWithToken(email, token);
  //   if(!response.success)
  //     return response;

  //   return Server.finishLogin();
  // }

  protected static async finishLogin() {
    // Service.setAuthorizationToken(Server.account.getAuthorizationToken());

    // let response = await Server.sync();
    // if(!response.success)
    //   return response;

    // await Server.network.connect();
  
    // // await this.user.setPresence('site');
    // Server.account.notifyListeners('login');

    // return {success: true};
  }

  public static async signOut() {
    // await Server.account.signOut();
    // Server.network.disconnect();
    // Server.account.notifyListeners('logout');
    
    // Server.user.clear();

    // if (Server.account.isMetamaskLoggedIn())
    //   localStorage.removeItem('metamask');
    // else
    //   await this.provider.disconnect();
      
    publish('wallet-events');
  }

  // public static async sync(): Promise<ServiceResponse> {
  //   let promises = [];
  //   // promises.push(Server.user.sync());

  //   let responses = await Promise.all(promises);

  //   for(let i = 0; i < responses.length; i++)
  //     if(!responses[i].success)
  //       return responses[i];


  //   return {success: true};
  // }

  // public static async refreshServiceLogin(): Promise<ServiceResponse> {
  //   let email = window.localStorage.getItem('RefreshEmail');
  //   let token = window.localStorage.getItem('RefreshToken');

  //   if(email && token) {
  //     let response = await Server.account.authenticateWithToken(email, token);
  //     if(!response.success)
  //       return response;

  //     console.log('Authentication token refreshed.');
        
  //     Service.setAuthorizationToken(Server.account.getAuthorizationToken());

  //     return response;
  //   }

  //   return {success: false};
  // }
}
