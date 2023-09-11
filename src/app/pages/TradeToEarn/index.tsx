import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderBar from '../../elements/HeaderBar';
import { riskCfg, RiskType } from './cfg';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import './styles.scss';
import { IconArrowDown } from '../Icons';

const TradeToEarn = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { risk } = params;
  const cfg = riskCfg[risk as RiskType];

  return (
    <div className="ww-page-container page-trade-to-earn">
      <HeaderBar text={cfg.title} />
      <h2>Recommended strategy:</h2>
      <div className="content-box">
        <div className="content-title-wrap" onClick={() => navigate('/spotGridStrategy')}>
          <h3>One-time decentralized automated trading bot</h3>
          <div className="icon-wrap">
            <RightOutlined rev={undefined} />
          </div>
        </div>
        <dl className="line">
          <dt>Strategy: </dt>
          <dd>Simple spot grid</dd>
        </dl>
        <dl className="line">
          <dt>Estimated return: </dt>
          <dd>{cfg.estimatedReturn}</dd>
        </dl>
        <dl>
          <dt>Sequence of operations:</dt>
          <dd>
            <p><strong>1.Swap USDC for ETH with</strong> gas about $0.04</p>
            <div className="icon-wrap">{IconArrowDown}</div>
            <p><strong>2.Buy ETH</strong> when the <strong>price falls {cfg.whenFallsToBuy}</strong></p>
            <div className="icon-wrap"><PlusOutlined rev={undefined} /></div>
            <p><strong>3.Sell ETH </strong>when the <strong> price rises {cfg.whenRisesToSell}</strong> each time</p>
            <div className="icon-wrap">{IconArrowDown}</div>
            <p><strong>4.Swap ETH for USDC</strong> with gas about $0.04</p>
          </dd>
        </dl>

      </div>

      <h2>Other trading strategies:</h2>
      <p>Coming soon...</p>
    </div>
  );
};

export default TradeToEarn;