import React from 'react';
import './AutotradebotOK.css';
import { Button, Space } from 'antd';

class RunBotPage extends React.Component {
  render() {
    return (
    <div>
        <div className="rt-page-container">
            <img className="rt-page-image" src="/icon/success.png" />
            <h2>Run Successfully!</h2>
            <div className="rt-page-text">AA bundlers will run your trading bot to execute your trading strategy, and submit corresponding transactions to trade for you under your authorization.</div>
        </div>
        <div className="ww-page-container">
            <Space style={{ width: '100%', justifyContent: 'center' }} size={80}>
                <Button shape="round" style={{ width: '100%'}}>view</Button>
                <Button shape="round" style={{ width: '100%'}}>Done</Button>
            </Space>
        </div>
    </div>
    );
  }
}

export default RunBotPage;