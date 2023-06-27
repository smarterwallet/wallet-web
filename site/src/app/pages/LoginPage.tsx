import React from 'react';
import './LoginPage.css';
import HeaderBar from '../elements/HeaderBar';
import { Navigate } from 'react-router-dom';

interface LoginPageState {
  username: string;
  password: string;
  navigate: string;
}

class LoginPage extends React.Component<{}, LoginPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
      navigate: '',
    }
  }

  componentDidMount(): void {
  }

  onLogin() {
    this.setState({navigate: '/home'});
  }

  render() {
    if (this.state.navigate != '') 
      return <Navigate to={this.state.navigate} />;

    return (
      <div className="login-page">
        <HeaderBar text='Login' />

        <br />
        <div>Username</div>
        <input />
        <br />
        <div>Password</div>
        <input />
        <br /><br />
        <button className='login-page-button' onClick={()=>this.onLogin()}>Login</button>
      </div>
    );
  }
}

export default LoginPage;