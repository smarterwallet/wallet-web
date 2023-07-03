import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Server } from '../server/server';
import HomePage from './pages/HomePage';
import SitePage from './pages/SitePage';
import LoadingPage from './pages/LoadingPage';
import PasswordPage from './pages/PasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';
import { AppConfig } from './AppConfig';
import RegisterPage from './pages/RegisterPage';
import RegisterPwdPage from './pages/RegisterPwdPage';
import CreateAccountPage from './pages/CreateAccountPage';
import WelcomePage from './pages/WelcomePage';
import AppsPage from './pages/AppsPage';
import AutoTradePage from './pages/AutoTradePage';
import AddTradeBotPage from './pages/AddTradeBotPage';
import EditTradeBotPage from './pages/EditTradeBotPage';
import RunBotPage from './pages/RunBotPage';
import AssetPage from './pages/AssetPage';
import LoginPage from './pages/LoginPage';
import SimpleTransactionPage from "./pages/SimpleTransaction";

interface AppState {
  allowAccess: boolean;
  postLoginPage: string;
  initialized: boolean;
  maintenance: boolean;
};

class App extends React.Component<{}, AppState> {
  constructor(props = {}) {
    super(props);

    this.state = {
      allowAccess: this.checkSecretPassword(),
      postLoginPage: 'account',
      initialized: false,
      maintenance: false
    }

    if(!this.state.maintenance)
      Server.init();

    this.setInitialized = this.setInitialized.bind(this);
    this.checkSecretPassword = this.checkSecretPassword.bind(this);
    this.setSecretPassword = this.setSecretPassword.bind(this);
    this.onAccountChanged = this.onAccountChanged.bind(this);

    window.addEventListener("beforeunload", function (e) {
      // Server.network.disconnect();
    });

  }

  componentDidMount() {
    // Server.account.addEventListener('login', this.onAccountChanged);
    // Server.account.addEventListener('logout', this.onAccountChanged);

    // if(!this.state.maintenance)
    //   Server.network.setPresence('site');
  }

  setInitialized() {
    this.setState({initialized: true});
  }

  checkSecretPassword() {
    return (localStorage.getItem('secret-password') === AppConfig.secretPassword);
  }

  setSecretPassword(password:string) {
    localStorage.setItem('secret-password', password);
    this.setState({allowAccess: this.checkSecretPassword()});
  }

  onAccountChanged() {
    this.forceUpdate();
  }

  render() {
    if (!this.state.initialized)
      return (<LoadingPage maintenance={this.state.maintenance} setInitialized={this.setInitialized} />);

    // if(!this.state.allowAccess)
    //   return (<PasswordPage setPassword={this.setSecretPassword} />);

    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SitePage />}>
            <Route index element={<WelcomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/asset/:id' element={<AssetPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/registerPwd' element={<RegisterPwdPage />} />
            <Route path='/createAccount' element={<CreateAccountPage />} />
            <Route path='/apps' element={<AppsPage />} />
            <Route path='/autoTrade' element={<AutoTradePage />} />
            <Route path='/addTradeBot' element={<AddTradeBotPage />} />
            <Route path='/editTradeBot' element={<EditTradeBotPage />} />
            <Route path='/runBot' element={<RunBotPage />} />
            <Route path='/simpleTransaction' element={<SimpleTransactionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
