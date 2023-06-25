import React from 'react';
import {Outlet} from 'react-router-dom';
import { subscribe } from '../util/event';
import NavBar from '../elements/NavBar';

class SitePage extends React.Component {

  componentDidMount(): void {
    subscribe('wallet-events', () => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div className="app-container">
        <div id="id-app-page" className="app-page">
          <Outlet />
        </div>
        <div className="app-navbar">
          <NavBar />
        </div>
      </div>
    );
  }
}

export default SitePage;
