import React from 'react';
import './RunBotPage.css';
import HeaderBar from '../elements/HeaderBar';

class RunBotPage extends React.Component {
  render() {
    return (
      <div className="rb-page">
        <HeaderBar text='Simple Transfer' />
        <div className='rb-page-container'>
          <img className="rb-page-image" src="/icon/success.png" />
          <div className="rb-page-content">Run successfully!</div>
        </div>
      </div>
    );
  }
}

export default RunBotPage;