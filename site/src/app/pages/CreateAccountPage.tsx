import React from 'react';
import './CreateAccountPage.css';
import { NavLink, Navigate } from 'react-router-dom';
import HeaderBar from '../elements/HeaderBar';

interface CreateAccountPageState {
  create: boolean;
  login: boolean;
  navigate: string;
}

class CreateAccountPage extends React.Component<{}, CreateAccountPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      create: true,
      login: false,
      navigate: '',
    }
  }

  toggleCreate() {
    this.setState({create: !this.state.create, login: false});
  }

  toggleLogin() {
    this.setState({login: !this.state.login, create: false});
  }

  onRegister() {
    this.setState({navigate: '/home'});
  }

  onLogin() {
    this.setState({navigate: '/home'});
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
              <input />
              <div style={{height: '10px'}} />
              <div>Password</div>
              <input />
              <button className='ca-page-button' onClick={()=>this.onRegister()}>Register</button>
            </div>
          }
        </div>

        <div className={`ca-page-menu-container ${this.state.login && 'extend'}`}>
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
        </div>
      </div>
    );
  }
}

export default CreateAccountPage;