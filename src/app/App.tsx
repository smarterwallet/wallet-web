import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Global } from '../server/Global';
import HomePage from './pages/HomePage';
import SitePage from './pages/SitePage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';
import WelcomePage from './pages/WelcomePage/welcomePage';
import AppsPage from './pages/AppsPage';
import AutoTradePage from './pages/AutoTradePage';
import AddTradeBotPage from './pages/AddTradeBotPage';
import EditTradeBotPage from './pages/EditTradeBotPage';
import RunBotPage from './pages/RunBotPage';
import AssetPage from './pages/AssetPage';
import LoginPage from './pages/Login';
import SimpleTransactionPage from './pages/SimpleTransaction';
import { Config } from '../server/config/Config';
import SignupAccountTypePage from './pages/signin/SignupAccountTypePage';
import GridStrategies from './pages/GridStrategies';
import SimpleTradingStrategy from './pages/SimpleTradingStrategy';
import SimpleTradingBot from './pages/SimpleTradingBot';
import Settings from './pages/Settings';
import SinglePartyAccountPage from './pages/signin/single/SinglePartyAccountPage';
import MultiPartyQuantityChoosePage from './pages/signin/multi/MultiPartyQuantityChoosePage';
import MultiPartyBackupKeysPage from './pages/signin/multi/MultiPartyBackupKeysPage';
import MultiPartyChooseStorePage from './pages/signin/multi/MultiPartyChooseStorePage';
import MultiParty_SignUp_Local from './pages/signin/multi/MultiParty_SignUp_Local';
import MultiParty_SignUp_OtherPeople from './pages/signin/multi/MultiParty_SignUp_OtherPeople';
import MultiPartyAccount from './pages/MultiPartyAccount';
import SignupAtMultiParty from './pages/SignupAtMultiParty';
import SignupSuccessfully from './pages/SignupSuccessfully';
import AutotradebotOK from './pages/AutotradebotOK';
import Demand from './pages/Demand';
import TradeToEarn from './pages/TradeToEarn';
import LoadingPageComponent from '../../src/app/pages/LoadingPage';
import SignUpPlayground from './component/SignUpPlayground';
import SignupMultiParty from './pages/SignupMultiParty';
import StrategyCreateSuccess from './pages/StrategyCreateSuccess';
import MyStrategys from './pages/MyStrategys';
import Cross from './pages/Cross';
import Contacts from './pages/Contacts';
import DemandChat from './pages/DemandChat';

const polygonConfig = require('./config/' + Config.DEFAULT_NETWORK.toLowerCase() + '.json');

const AppComponent = () => {
  const [initialized, setInitialized] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    if (!maintenance) {
      Config.init(JSON.stringify(polygonConfig)).then(() => {
        console.log('config init success');
        Global.init().then(() => {
          console.log('global variable init success');
        });
      });
    }
    window.addEventListener('beforeunload', function () {
      // Global.network.disconnect();
    });
    return () => {
      window.removeEventListener('beforeunload', function () {
        // Global.network.disconnect();
      });
    };
  }, [maintenance]);

  if (!initialized) {
    return <LoadingPageComponent maintenance={maintenance} setInitialized={setInitialized} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SitePage />}>
          <Route index element={<WelcomePage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/demand" element={<Demand />} />
          <Route path="/cross" element={<Cross />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/demandchat" element={<DemandChat />} />
          <Route path="/asset/:id" element={<AssetPage />} />
          <Route path="/signup" element={<SignUpPlayground />} />
          <Route path="/signup/multiSignup" element={<SignupMultiParty />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/multiPartyAccount" element={<MultiPartyAccount />} />
          <Route path="/signupAtMultiParty" element={<SignupAtMultiParty />} />
          <Route path="/signupSuccessfully" element={<SignupSuccessfully />} />
          <Route path="/signin/signupAccountType" element={<SignupAccountTypePage />} />
          <Route path="/signin/singlePartyAccount" element={<SinglePartyAccountPage />} />
          <Route path="/signin/multi/multiPartyQuantityChoosePage" element={<MultiPartyQuantityChoosePage />} />
          <Route path="/signin/multi/multiPartyBackupKeysPage" element={<MultiPartyBackupKeysPage />} />
          <Route path="/signin/multi/multiPartyChooseStorePage" element={<MultiPartyChooseStorePage />} />
          <Route path="/signin/multi/multiParty-SignUp-Local" element={<MultiParty_SignUp_Local />} />
          <Route path="/signin/multi/multiParty-SignUp-OtherPeople" element={<MultiParty_SignUp_OtherPeople />} />

          <Route path="/apps" element={<AppsPage />} />
          <Route path="/autoTrade" element={<AutoTradePage />} />
          <Route path="/addTradeBot" element={<AddTradeBotPage />} />
          <Route path="/editTradeBot" element={<EditTradeBotPage />} />
          <Route path="/runBot" element={<RunBotPage />} />
          <Route path="/simpleTransaction" element={<SimpleTransactionPage />} />
          <Route path="/automaticTrading" element={<MyStrategys />} />
          <Route path="/gridStrategies" element={<GridStrategies />} />
          <Route path="/gridStrategies" element={<GridStrategies />} />
          <Route path="/simpleStrategy" element={<SimpleTradingStrategy />} />
          <Route path="/spotGridBot" element={<SimpleTradingBot />} />
          <Route path="/autotradebotok" element={<AutotradebotOK />} />
          <Route path="/tradeToEarn/:risk" element={<TradeToEarn />} />
          <Route path="/strategyCreateSuccess" element={<StrategyCreateSuccess />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppComponent;
