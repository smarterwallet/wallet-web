import React from 'react';
import '../SimpleTrading/styles.scss';
import { Button, Space } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const StrategyCreateSuccess = () => {
  const navigate = useNavigate();
  const Done = () => {
    navigate('/demand');
  };
  const View = () => {};
  return (
    <div className="ww-page-container bot-create-success">
      <svg
        className="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1464"
        width="180"
        height="180"
      >
        <path
          d="M85.333333 512C85.333333 276.352 276.309333 85.333333 512 85.333333c235.648 0 426.666667 190.976 426.666667 426.666667 0 235.648-190.976 426.666667-426.666667 426.666667-235.648 0-426.666667-190.976-426.666667-426.666667z m376.64 74.325333l-105.642666-105.642666a21.248 21.248 0 0 0-30.122667 0.042666c-8.32 8.32-8.213333 21.973333-0.064 30.101334l120.810667 120.832a21.248 21.248 0 0 0 30.122666-0.085334l211.157334-211.157333a21.290667 21.290667 0 0 0 0-30.186667 21.397333 21.397333 0 0 0-30.250667 0.106667l-196.010667 195.989333z"
          fill="#20ae2a"
          p-id="1465"
        ></path>
      </svg>
      <div className="text">
        <p>Run successfully!</p>
        AA bundlers will run your trading bot to execute your trading strategy, and submit corresponding transactions to
        trade for you under your authorization
      </div>
      <Space style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }} size={80}>
        <Button shape="round" onClick={Done}>
          Done
        </Button>
        <Button shape="round" onClick={View}>
          View <RightOutlined rev={undefined} />
        </Button>
      </Space>
    </div>
  );
};

export default StrategyCreateSuccess;
