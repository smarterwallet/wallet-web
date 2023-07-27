import React from 'react';
import './EditTradeBotPage.css';
import { Navigate } from 'react-router-dom';
import HeaderBar from '../elements/HeaderBar';

interface EditTradeBotPageState {
  navigate: string;
}

class EditTradeBotPage extends React.Component<{}, EditTradeBotPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      navigate: '',
    }
  }

  onRun() {
    this.setState({navigate: '/runBot'});
  }

  render() {
    if (this.state.navigate !== '')
      return <Navigate to={this.state.navigate} />;

    return (
      <div className='etb-page'>
        <HeaderBar text='MEV Arbitrage Bot' />

        <div>Bot name</div>
        <input disabled={true} />
        <div style={{height: '15px'}} />

        <div>Trading type</div>
        <select
          className="etb-page-select" 
          disabled={true}
          // value={this.state.category} 
          // onChange={this.onCategoryChange}
        >
          <option value="main">Main</option>
          <option value="testnet">Testnet</option>
        </select>
        <div style={{height: '15px'}} />

        <div>Triggering condition</div>
        <select
          className="etb-page-select" 
          disabled={true}
          // value={this.state.category} 
          // onChange={this.onCategoryChange}
        >
          <option value="main">Main</option>
          <option value="testnet">Testnet</option>
        </select>
        <div style={{height: '15px'}} />

        <div>Step</div>
        <div className='etb-page-step-container'>
          <div>
            <div>Action</div>
            <select className="etb-page-step-select" disabled={true}>
            </select>
          </div>

          <div>
            <div>Asset</div>
            <select className="etb-page-step-select" disabled={true}>
            </select>
          </div>

          <div>
            <div>Amount</div>
            <select className="etb-page-step-select" disabled={true}>
            </select>
          </div>

          <div>
            <div>Target</div>
            <select className="etb-page-step-select" disabled={true}>
            </select>
          </div>
        </div>
        <div style={{height: '15px'}} />

        <div className='etb-page-edit-container'>
          <div>
            <div>Gas Asset</div>
            <select className="etb-page-edit-select">
            </select>
          </div>

          <div>
            <div>Gas Amount</div>
            <input className="etb-page-edit-input" />
          </div>

          <div>
            <div>Starting Time</div>
            <select className="etb-page-edit-select">
            </select>
          </div>

          <div>
            <div>Ending Time</div>
            <select className="etb-page-edit-select">
            </select>
          </div>
        </div>

        <div className='etb-page-button-container'>
          <button className='etb-page-button'>Edit</button>
          <button className='etb-page-button' onClick={()=>this.onRun()}>Run</button>
        </div>
      </div>
    );
  }
}

export default EditTradeBotPage;