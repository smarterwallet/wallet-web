import React from 'react';
import './CreateAccountPage.css';
import {Navigate} from 'react-router-dom';
import HeaderBar from '../elements/HeaderBar';
import {Global} from '../../server/Global';
import MessageModal from '../modals/MessageModal';
import AlertModal from '../modals/AlertModal';
import {ethers} from "ethers";
import {TxUtils} from "../../server/utils/TxUtils";

interface CreateAccountPageState {
  create: boolean;
  login: boolean;
  navigate: string;
  username: string;
  password: string;
  message: string;
  alert: string;
  loading: boolean;
}

class CreateAccountPage extends React.Component<{}, CreateAccountPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      create: true,
      login: false,
      navigate: '',
      username: '',
      password: '',
      message: '',
      alert: '',
      loading: false,
    }

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  onUsernameChange(e: any) {
    this.setState({username: e.currentTarget.value});
  };

  onPasswordChange(e: any) {
    this.setState({password: e.currentTarget.value});
  };

  toggleCreate() {
    this.setState({create: !this.state.create, login: false});
  }

  toggleLogin() {
    this.setState({login: !this.state.login, create: false});
  }

  async onRegister() {
    if (this.state.username.trim() === '' || this.state.password.trim() === '') {
      this.setState({alert: 'Username or Password can not be empty.'});
      return;
    }

    let smarterWalletKey = localStorage.getItem('smarter-wallet-key');
    if (smarterWalletKey != null && smarterWalletKey !== '') {
      this.setState({alert: 'You have already registered please login directly.'});
      return;
    }

    this.setState({message: 'Registering...'});

    let account = ethers.Wallet.createRandom();

    this.encryptKey(account.privateKey, this.state.username, this.state.password);

    // create smart contract account on chain
    let params = {
      "address": account.address
    }
    let tx = await Global.account.createSmartContractWalletAccount(params);
    await TxUtils.checkTransactionStatus(Global.account.ethersProvider, tx.body["result"]);

    Global.account.initAccount(account.privateKey);
    let address = Global.account.contractWalletAddress;

    localStorage.setItem('username', this.state.username);
    localStorage.setItem('address', address);
    Global.account.isLoggedIn = true;

    this.setState({navigate: '/login', message: ''});
  }

  onLogin() {
    // this.setState({navigate: '/home'});

    // let isLogin = this.decryptKey('name', 'passwor');
    // console.log("isLogin:", isLogin)
  }

  encryptKey(privKey: string, username: string, password: string) {
    let str = username + password + privKey;
    let key = window.btoa(str); // encrypt
    // console.log("smarter-wallet-key:", key)
    localStorage.setItem('smarter-wallet-key', key);

    // generate loginkey
    str = username + password + key;
    key = window.btoa(str); // encrypt
    // console.log("loginkey:", key)
    localStorage.setItem('loginkey', key);
  }
  
  render() {
    if (this.state.navigate !== '')
      return <Navigate to={this.state.navigate} />;

    return (
      <div className="ca-page">
        <div style={{paddingLeft: '20px'}}><HeaderBar text='Local' /></div>
        
        <div className={`ca-page-menu-container ${this.state.create && 'extend'}`}>
          <div className='ca-page-menu-header' onClick={()=> this.toggleCreate()}>
            <img className="ca-page-menu-icon" src="/icon/user.png" alt=""/>
            <div>Create New Account</div>
            <img className="ca-page-menu-arrow" src={`/icon/arrow-${this.state.create ? 'up' : 'down'}.png`} alt=""/>
          </div>

          {this.state.create && 
            <div className='ca-page-menu-content'>
              <div>Username</div>
              <input value={this.state.username} onChange={this.onUsernameChange} />
              <div style={{height: '10px'}} />
              <div>Password</div>
              <input type="password" value={this.state.password} onChange={this.onPasswordChange} />
              <button className='ca-page-button' onClick={()=>this.onRegister()}>Register</button>
            </div>
          }
        </div>

        <MessageModal message={this.state.message}/>
        <AlertModal message={this.state.alert} button="OK" onClose={()=>this.setState({alert: ''})}/>
      </div>
    );
  }
}

export default CreateAccountPage;