import React from 'react';
import './AddTradeBotPage.css';
import { NavLink, Navigate } from 'react-router-dom';
import HeaderBar from '../elements/HeaderBar';

interface AutoTradePageState {
  new: boolean;
  exist: boolean;
  navigate: string;
}

class AddTradeBotPage extends React.Component<{}, AutoTradePageState> {

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

  render() {
    if (this.state.navigate !== '')
      return <Navigate to={this.state.navigate} />;

    return (
      <div className='atb-page'>
        <HeaderBar text='Add a Trading Bot' />
        
        <div>Bot name</div>
        <input />
        <div style={{height: '15px'}} />

        <div>Trading type</div>
        <select
          className="atb-page-select" 
          // value={this.state.category} 
          // onChange={this.onCategoryChange}
        >
          <option value="main">Main</option>
          <option value="testnet">Testnet</option>
        </select>
        <div style={{height: '15px'}} />

        <div>Triggering condition</div>
        <select
          className="atb-page-select" 
          // value={this.state.category} 
          // onChange={this.onCategoryChange}
        >
          <option value="main">Main</option>
          <option value="testnet">Testnet</option>
        </select>
        <div style={{height: '15px'}} />

        <div>Step</div>
        <div className='atb-page-step-container'>
          <div>
            <div>Action</div>
            <select className="atb-page-step-select">
            </select>
          </div>

          <div>
            <div>Asset</div>
            <select className="atb-page-step-select">
            </select>
          </div>

          <div>
            <div>Amount</div>
            <select className="atb-page-step-select">
            </select>
          </div>

          <div>
            <div>Target</div>
            <select className="atb-page-step-select">
            </select>
          </div>
        </div>
        <div style={{height: '15px'}} />

        <div className='atb-page-button-container'>
          <button className='atb-page-button'>Save</button>
          <button className='atb-page-button' onClick={()=> window.history.back()}>Finish</button>
        </div>
      </div>
    );
  }
}

export default AddTradeBotPage;