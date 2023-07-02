import React from 'react';
import './CreateAccountPage.css';
import { NavLink, Navigate } from 'react-router-dom';
import HeaderBar from '../elements/HeaderBar';
import { Server } from '../../server/server';
import MessageModal from '../modals/MessageModal';
import AlertModal from '../modals/AlertModal';

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

    this.setState({message: 'Registering...'});

    let account = Server.web3.eth.accounts.create();
    console.log("account:", account)

    // 
    this.encryptKey(account.privateKey, this.state.username, this.state.password);
    
    // What's purpose of the createAccount api?
    // let params = {
    //   "address": account.address
    // }
    // let address = Server.account.createAccount(params);

    let address = await Server.account.getAddress(account.address, 0);
    console.log("address:", address)
    
    localStorage.setItem('username', this.state.username);
    localStorage.setItem('address', address);
    localStorage.setItem('isLoggedIn', '1');

    this.setState({navigate: '/home', message: ''});
  }

  onLogin() {
    // this.setState({navigate: '/home'});

    // let isLogin = this.decryptKey('name', 'passwor');
    // console.log("isLogin:", isLogin)
  }

  encryptKey(privKey: string, username: string, password: string) {
    let str = username + password + privKey;
    let key = window.btoa(str); // encrypt
    // console.log("aakey:", key)
    localStorage.setItem('aakey', key);

    // generate loginkey
    str = username + password + key;
    key = window.btoa(str); // encrypt
    // console.log("loginkey:", key)
    localStorage.setItem('loginkey', key);
  }
  
  render() {
    if (this.state.navigate != '') 
      return <Navigate to={this.state.navigate} />;

    return (
      <div className="ca-page">
        <div style={{paddingLeft: '20px'}}><HeaderBar text='DeStorage' /></div>
        
        <div className={`ca-page-menu-container ${this.state.create && 'extend'}`}>
          <div className='ca-page-menu-header' onClick={()=> this.toggleCreate()}>
            <img className="ca-page-menu-icon" src="/icon/user.png" />
            <div>Create New Account</div>
            <img className="ca-page-menu-arrow" src={`/icon/arrow-${this.state.create ? 'up' : 'down'}.png`} />
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

        {/* <div className={`ca-page-menu-container ${this.state.login && 'extend'}`}>
          <div className='ca-page-menu-header' onClick={()=> this.toggleLogin()}>
            <img className="ca-page-menu-icon" src="/icon/user.png" />
            <div>Login</div>
            <img className="ca-page-menu-arrow" src={`/icon/arrow-${this.state.login ? 'up' : 'down'}.png`} />
          </div>

          {this.state.login && 
            <div className='ca-page-menu-content'>
              <div>Username</div>
              <input />
              <div style={{height: '10px'}} />
              <div>Password</div>
              <input />
              <button className='ca-page-button' onClick={()=>this.onLogin()}>Login</button>
            </div>
          }
        </div> */}

        <MessageModal message={this.state.message}/>
        <AlertModal message={this.state.alert} button="OK" onClose={()=>this.setState({alert: ''})}/>
      </div>
    );
  }
}

export default CreateAccountPage;