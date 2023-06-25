import { Server } from './server';
import { Service, ServiceResponse } from './service';

export class AccountService extends Service {
  // protected cognitoUser: CognitoUser;
  // protected cognitoPool: CognitoUserPool;
  // protected signUpEmail: string;
  // protected signUpPassword: string;

  constructor() {
    super();
    // this.cognitoUser = null;
    // this.cognitoPool = new CognitoUserPool({
    //   UserPoolId: 'us-west-2_sBvjYyNzN',
    //   ClientId: '48npo6k7iogolgq0qvntl8k5m0'
    // });
  }

  // isLoggedIn():boolean {
  //   if (Server.account.isMetamaskLoggedIn())
  //     return true;
  //   else
  //     if (Server.provider)
  //       return (Server.provider.accounts.length > 0);
  //     else
  //       return false;
  // }

  isMetamaskLoggedIn():boolean {
    return (localStorage.getItem('metamask') != null);
  }

  getEmail():string {
    // if(this.cognitoUser) {
    //   if(this.cognitoUser.getSignInUserSession())
    //     return this.cognitoUser.getSignInUserSession().getIdToken().payload.email;
    //   else
    //     return this.cognitoUser.getUsername();
    // }
    return '';
  }

  // signUp(email:string, password:string): Promise<ServiceResponse> {
    // this.signUpEmail = email;
    // this.signUpPassword = password;

    // return new Promise((resolve)=>{
    //   this.cognitoPool.signUp(email, password, [], null, (err, data)=>{
    //     if(err)
    //       resolve({success: false, message: err.message});
    //     else {
    //       this.cognitoUser = data.user;
    //       resolve({success: true});
    //     }
    //   });
    // });
  // }

  // confirmRegistration(code:string): Promise<ServiceResponse> {
    // if(!this.cognitoUser) {
    //   this.cognitoUser = new CognitoUser({
    //     Username: this.signUpEmail,
    //     Pool: this.cognitoPool
    //   })
    // }

    // return new Promise((resolve)=>{
    //   this.cognitoUser.confirmRegistration(code, true, async (err, result) => {
    //     if(err)
    //       resolve({success: false, message: err.message});
    //     else 
    //       resolve({success: true});
    //   });
    // });
  // }

  // resendConfirmationCode(): Promise<ServiceResponse> {
  //   return new Promise((resolve)=>{
  //     if(!this.cognitoUser) {
  //       resolve({success: false, message: 'No user defined!'});
  //       return;
  //     }
  
  //     this.cognitoUser.resendConfirmationCode((err, result)=>{
  //       if(err)
  //         resolve({success: false, message: err.message});
  //       else
  //         resolve({success: true});
  //     });
  //   });
  // }

  // authenticate(email:string, password:string): Promise<ServiceResponse> {
  //   return new Promise((resolve)=>{
  //     this.cognitoUser = new CognitoUser({
  //       Username: email,
  //       Pool: this.cognitoPool
  //     })
  
  //     let authenticationDetails = new AuthenticationDetails({
  //       Username: email,
  //       Password: password,
  //     });

  //     this.cognitoUser.authenticateUser(authenticationDetails, {
  //       onSuccess: (result)=>{
  //         resolve({success: true});
  //       },
  //       onFailure: (err)=>{
  //         resolve({success: false, message: err.message});
  //       }
  //     });
  //   });
  // }

  // authenticateWithToken(email:string, token:string): Promise<ServiceResponse> {
  //   return new Promise((resolve)=>{
  //     this.cognitoUser = new CognitoUser({
  //       Username: email,
  //       Pool: this.cognitoPool
  //     })

  //     let refreshToken = new CognitoRefreshToken({RefreshToken: token});
  
  //     this.cognitoUser.refreshSession(refreshToken, (err, session)=> {
  //       if(err)
  //         resolve({success: false, message: err.message});
  //       else
  //         resolve({success: true});
  //     });
  //   });
  // }

  // forgotPassword(email:string): Promise<ServiceResponse> {
  //   if(!this.cognitoUser) {
  //     this.cognitoUser = new CognitoUser({
  //       Username: email,
  //       Pool: this.cognitoPool
  //     })
  //   }

  //   return new Promise((resolve)=>{
  //     this.cognitoUser.forgotPassword({
  //       onSuccess: (data)=>{
  //         resolve({success: true});
  //       },
  //       onFailure: (err)=>{
  //         resolve({success: false, message: err.message});
  //       }
  //     });
  //   });
  // }

  // confirmPassword(code:string, newPassword:string): Promise<ServiceResponse> {
  //   return new Promise((resolve)=>{
  //     if(!this.cognitoUser) {
  //       resolve({success: false, message: 'No user defined!'});
  //       return;
  //     }
  
  //     this.cognitoUser.confirmPassword(code, newPassword, {
  //       onSuccess: (data)=>{
  //         resolve({success: true});
  //       },
  //       onFailure: (err)=>{
  //         resolve({success: false, message: err.message});
  //       }
  //     });
  //   });
  // }

  // signOut(): Promise<ServiceResponse> {
  //   return new Promise((resolve)=>{
  //     if(!this.cognitoUser) {
  //       resolve({success: false, message: 'No user defined!'});
  //     }
  //     else {
  //       this.cognitoUser.signOut(()=>{
  //         resolve({success: true});
  //       });
  //     }
  //   });
  // }

  // changePassword(oldPassword:string, newPassword:string): Promise<ServiceResponse> {
  //   return new Promise((resolve)=>{
  //     if(!this.cognitoUser) {
  //       resolve({success: false, message: 'No user defined!'});
  //     }
  //     else {
  //       this.cognitoUser.changePassword(oldPassword, newPassword, (err, message)=>{
  //         if(err)
  //           resolve({success: false, message: err.message});
  //         else
  //           resolve({success: true});
  //       });
  //     }
  //   });
  // }

  // deleteUser(): Promise<ServiceResponse> {
  //   return new Promise(async (resolve)=>{
  //     if(!this.cognitoUser) {
  //       resolve({success: false, message: 'No user defined!'});
  //     }
  //     else {
  //       await this.signOut();
  //       this.cognitoUser.deleteUser(()=>{
  //         resolve({success: true});
  //       });
  //     }
  //   });
  // }

  // changeEmail(email:string): Promise<ServiceResponse> {
  //   return new Promise((resolve)=>{
  //     if(!this.cognitoUser) {
  //       resolve({success: false, message: 'No user defined!'});
  //     }
  //     else {
  //       let attribute = new CognitoUserAttribute({
  //         Name: 'email',
  //         Value: email
  //       });
    
  //       let attributeList = [];
  //       attributeList.push(attribute);
    
  //       this.cognitoUser.updateAttributes(attributeList, function(err, result) {
  //         if (err)
  //           resolve({success: false, message: err.message});
  //         else 
  //           resolve({success: true});
  //       });
  //     }
  //   });
  // }

  // verifyEmail(code:string): Promise<ServiceResponse> {
  //   return new Promise((resolve)=>{
  //     if(!this.cognitoUser) {
  //       resolve({success: false, message: 'No user defined!'});
  //     }
  //     else {
  //       this.cognitoUser.verifyAttribute('email', code, {
  //         onSuccess: (result)=>{
  //           this.cognitoUser.refreshSession(this.cognitoUser.getSignInUserSession().getRefreshToken(), (err:Error, session:CognitoUserSession)=>{
  //             if(err)
  //               resolve({success: false, message: err.message});
  //             else
  //               resolve({success: true});
  //           })
  //         },
  //         onFailure: (err)=>{
  //           resolve({success: false, message: err.message});
  //         }
  //       });
  //     }
  //   });
  // }

  getUserId(): string {
    // if(this.isLoggedIn())
    //   return this.cognitoUser.getUsername();
    return '';
  }

  getAuthorizationToken(): string {
    // if(this.isLoggedIn())
    //   return this.cognitoUser.getSignInUserSession().getIdToken().getJwtToken();
    return '';
  }

  getRefreshToken(): string {
    // if(this.isLoggedIn())
    //   return this.cognitoUser.getSignInUserSession().getRefreshToken().getToken();
    return '';
  }

  getAccessToken(): string {
    // if(this.isLoggedIn())
    //   return this.cognitoUser.getSignInUserSession().getAccessToken().getJwtToken();
    return '';
  }

  // getWallet(): string {
  //   if (Server.account.isMetamaskLoggedIn())
  //     return this.getMetamaskAccount();
  //   else
  //     if (this.isLoggedIn())
  //       return Server.provider.accounts[0];
  //     else
  //       return '';
  // }

  getMetamaskAccount(): string {
    return localStorage.getItem('metamask');
  }

}

