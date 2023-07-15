import React from 'react';
import { AppConfig } from '../AppConfig';
import './PasswordPage.css'

interface PasswordPageProps {
  setPassword:(password:string) => void;
}

interface PasswordPageState {
  password: string;
}

class PasswordPage extends React.Component<PasswordPageProps, PasswordPageState> {
  constructor(props:PasswordPageProps) {
    super(props);

    this.state = {password: ''};

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  onChange(e: React.FormEvent<HTMLInputElement>): void {
    this.setState({password: e.currentTarget.value});
  };

  onKeyDown(e:any): void {
    if (e.key === 'Enter') 
      this.processPassword();
  };

  onEnter() {
    this.processPassword();
  }

  processPassword() {
    let password = this.state.password;
    this.setState({password: ''});
    this.props.setPassword(password);
  }

  render() {
    return (
      <div className="password-container">
        <h2>{AppConfig.siteName}</h2>
        <div>Enter the secret password:</div>
        <div>
          <input type="password" className="password-input" autoComplete="off" data-lpignore="true" value={this.state.password} onChange={this.onChange} onKeyDown={this.onKeyDown}></input>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
          <button onClick={this.onEnter}>Continue</button>
        </div>
      </div>
    )
  }
}

export default PasswordPage;