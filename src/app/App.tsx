import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Global } from '../server/Global';
import HomePage from './pages/HomePage';
import SitePage from './pages/SitePage';
import LoadingPage from './pages/LoadingPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';
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
import SimpleTransactionPage from './pages/SimpleTransaction';
import { Config } from '../server/config/Config';
import RegisterAccountTypePage from './pages/signin/RegisterAccountTypePage';
import AutomaticTrading from './pages/AutomaticTrading';
import GridStrategies from './pages/GridStrategies';
import SpotGrid from './pages/SpotGrid';
import SpotGridStrategy from './pages/SpotGridStrategy';
import SpotGridBot from './pages/SpotGridBot';
import SinglePartyAccountPage from './pages/signin/single/SinglePartyAccountPage';
import MultiPartyQuantityChoosePage from './pages/signin/multi/MultiPartyQuantityChoosePage';
import MultiPartyBackupKeysPage from './pages/signin/multi/MultiPartyBackupKeysPage';
import MultiPartyChooseMenuPage from './pages/signin/multi/MultiPartyChooseStorePage';
import MultiPartyChooseStorePage from './pages/signin/multi/MultiPartyChooseStorePage';
import MultiParty_SignUp_Local from './pages/signin/multi/MultiParty_SignUp_Local';

const polygonConfig = require('./config/' + Config.DEFAULT_NETWORK.toLowerCase() + '.json');

interface AppState {
  postLoginPage: string;
  initialized: boolean;
  maintenance: boolean;
}

class App extends React.Component<{}, AppState> {
  constructor(props = {}) {
    super(props);

    this.state = {
      postLoginPage: 'account',
      initialized: false,
      maintenance: false,
    };

    if (!this.state.maintenance) {
      Config.init(JSON.stringify(polygonConfig)).then((e) => {
        console.log('config init success');
        Global.init().then((e) => {
          console.log('global variable init success');
        });
      });
    }

    this.setInitialized = this.setInitialized.bind(this);
    this.onAccountChanged = this.onAccountChanged.bind(this);

    window.addEventListener('beforeunload', function (e) {
      // Global.network.disconnect();
    });
  }

  componentDidMount() {
    // Global.account.addEventListener('login', this.onAccountChanged);
    // Global.account.addEventListener('logout', this.onAccountChanged);
    // if(!this.state.maintenance)
    //   Global.network.setPresence('site');
  }

  setInitialized() {
    this.setState({ initialized: true });
  }

  onAccountChanged() {
    this.forceUpdate();
  }

  render() {
    if (!this.state.initialized)
      return <LoadingPage maintenance={this.state.maintenance} setInitialized={this.setInitialized} />;

    // if(!this.state.allowAccess)
    //   return (<PasswordPage setPassword={this.setSecretPassword} />);

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SitePage />}>
            <Route index element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/asset/:id" element={<AssetPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/signin/registerAccountType" element={<RegisterAccountTypePage />} />
            <Route path="/signin/singlePartyAccount" element={<SinglePartyAccountPage />} />
            <Route path="/signin/multi/multiPartyQuantityChoosePage" element={<MultiPartyQuantityChoosePage />} />
            <Route path="/signin/multi/multiPartyBackupKeysPage" element={<MultiPartyBackupKeysPage />} />
            <Route path="/signin/multi/multiPartyChooseStorePage" element={<MultiPartyChooseStorePage />} />
            <Route path="/signin/multi/MultiParty-SignUp-Local" element={<MultiParty_SignUp_Local />} />

            <Route path="/registerPwd" element={<RegisterPwdPage />} />
            <Route path="/createAccount" element={<CreateAccountPage />} />
            <Route path="/apps" element={<AppsPage />} />
            <Route path="/autoTrade" element={<AutoTradePage />} />
            <Route path="/addTradeBot" element={<AddTradeBotPage />} />
            <Route path="/editTradeBot" element={<EditTradeBotPage />} />
            <Route path="/runBot" element={<RunBotPage />} />
            <Route path="/simpleTransaction" element={<SimpleTransactionPage />} />
            <Route path="/automaticTrading" element={<AutomaticTrading />} />
            <Route path="/gridStrategies" element={<GridStrategies />} />
            <Route path="/gridStrategies" element={<GridStrategies />} />
            <Route path="/spotGrid" element={<SpotGrid />} />
            <Route path="/spotGridStrategy" element={<SpotGridStrategy />} />
            <Route path="/spotGridBot" element={<SpotGridBot />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
