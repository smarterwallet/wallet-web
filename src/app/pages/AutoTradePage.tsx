import React from 'react';
import './AutoTradePage.css';
import { NavLink, Navigate } from 'react-router-dom';
import HeaderBar from '../elements/HeaderBar';

interface AutoTradePageState {
  new: boolean;
  exist: boolean;
  navigate: string;
}

class AutoTradePage extends React.Component<{}, AutoTradePageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      new: true,
      exist: false,
      navigate: '',
    }
  }

  toggleNew() {
    this.setState({new: !this.state.new, exist: false});
  }

  toggleExist() {
    this.setState({exist: !this.state.exist, new: false});
  }

  onTemplate() {
    this.setState({navigate: '/home'});
  }

  onScratch() {
    this.setState({navigate: '/home'});
  }

  renderButton(icon: string, text: string, to: string) {
    return (
      <NavLink className='at-page-button-container' to={to}>
        <img className="at-page-menu-icon" src={icon} />
        <div>{text}</div>
        <img className="at-page-menu-arrow" src="/icon/arrow-right.png" />
      </NavLink>
    );
  }

  render() {
    if (this.state.navigate !== '')
      return <Navigate to={this.state.navigate} />;

    return (
      <div className="at-page">
        <div style={{paddingLeft: '20px'}}><HeaderBar text='Automatic Trading' /></div>

        <div className={`at-page-menu-container ${this.state.new && 'extend'}`}>
          <div className='at-page-menu-header' onClick={()=> this.toggleNew()}>
            <img className="at-page-menu-icon" src="/icon/robot.png" />
            <div>Add New Trading Bot</div>
            <img className="at-page-menu-arrow" src={`/icon/arrow-${this.state.new ? 'up' : 'down'}.png`} />
          </div>

          {this.state.new && 
            <div className='at-page-menu-content'>
              <div className='at-page-menu-text'>
                Design and pre-authorize your trading conditions and strategies via smart contracts, 
                and decentralized AA bundlers will execute them for you automatically
              </div>

              {this.renderButton('/icon/files.png', 'Create from templates', '/addTradeBot')}
              {this.renderButton('/icon/add.png', 'Create from scratch', '/addTradeBot')}
            </div>
          }
        </div>

        <div className={`at-page-menu-container ${this.state.exist && 'extend'}`}>
          <div className='at-page-menu-header' onClick={()=> this.toggleExist()}>
            <img className="at-page-menu-icon" src="/icon/robot.png" />
            <div>Choose a Existing One</div>
            <img className="at-page-menu-arrow" src={`/icon/arrow-${this.state.exist ? 'up' : 'down'}.png`} />
          </div>

          {this.state.exist && 
            <div className='at-page-menu-content'>
              {this.renderButton('/icon/robot.png', 'MEV Arbitrage Bot', '/editTradeBot')}
            </div>
          }
        </div>
      </div>
    );
  }
}

export default AutoTradePage;