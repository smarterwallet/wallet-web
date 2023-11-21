import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderBar from '../../elements/HeaderBar';
import { riskCfg, RiskType } from './cfg';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import './styles.scss';
import { IconArrowDown } from '../Icons';
import { HttpUtils } from '../../../server/utils/HttpUtils';

const TradeToEarn = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const requestData = useRef();
  const { risk } = params;
  const cfg = riskCfg[risk as RiskType];

  useEffect(() => {
    HttpUtils.post('https://smarter-api-da.web3idea.xyz/v1/demand', {
      "category": "trade2Earn",
      "demand": risk
    }).then((res) => {
      console.log(res);
      const data = res.body;
      requestData.current = data;
      setLoading(false);
    })
  }, [])

  {/* @ts-ignore*/}
  const estimatedReturn = `${requestData.current?.min_return*100}%~${requestData.current?.max_return*100}%`
  const title = cfg?.title ?? (loading ? 'Loading...' : `${estimatedReturn} Return`);


  return (
    <div className="ww-page-container page-trade-to-earn">
      <HeaderBar text={title} />
      <Skeleton loading={loading}>
        <h2>Recommended strategy:</h2>
        <div className="content-box">
          <div className="content-title-wrap" onClick={() => navigate('/SpotGridBot', { state: requestData.current } )}>
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
            {/* @ts-ignore*/}
            <dd>{`${requestData.current?.min_return*100}%~${requestData.current?.max_return*100}%`}</dd>
          </dl>
          <dl>
            <dt>Sequence of operations:</dt>
            <dd className="sequence-opt-wrap">
              {
                // @ts-ignore
                requestData.current?.operations?.map((opt, optIndex) => {
                  if (opt.type === 'swap') {
                    return (
                      <React.Fragment key={optIndex}>
                        <p><strong>{optIndex + 1}.Swap {opt?.param?.from} for {opt?.param?.to} with</strong> gas about {opt.param.gas_fee}{opt.param.fee_uint}</p>
                        <div className="icon-wrap">{IconArrowDown}</div>
                      </React.Fragment>
                    )
                  }

                  if (opt.type === 'sell') {
                    return opt.param.conditions.map((condition: any, cIndex: number) => {
                      return (
                        <React.Fragment key={optIndex + cIndex + 1}>
                          <p><strong>{optIndex + cIndex + 1}.Sell {condition.tokenName} </strong>when the <strong> price rises {condition.percentage*100}%</strong> each time</p>
                          <div className="icon-wrap">{IconArrowDown}</div>
                        </React.Fragment>
                      )
                    })
                  }

                  if (opt.type === 'buy') {
                    return opt.param.conditions.map((condition: any, cIndex: number) => {
                      return (
                        <React.Fragment key={optIndex + cIndex + 1}>
                          <p><strong>{optIndex + cIndex + 1}.Buy {condition.tokenName} </strong>when the <strong> price falls {condition.percentage*100}%</strong> each time</p>
                          <div className="icon-wrap">{IconArrowDown}</div>
                        </React.Fragment>
                      )
                    })
                  }
                })
              }
              {/*<p><strong>1.Swap USDC for ETH with</strong> gas about $0.04</p>*/}
              {/*<div className="icon-wrap">{IconArrowDown}</div>*/}
              {/*<p><strong>2.Buy ETH</strong> when the <strong>price falls {cfg.whenFallsToBuy}</strong></p>*/}
              {/*<div className="icon-wrap"><PlusOutlined rev={undefined} /></div>*/}
              {/*<p><strong>3.Sell ETH </strong>when the <strong> price rises {cfg.whenRisesToSell}</strong> each time</p>*/}
              {/*<div className="icon-wrap">{IconArrowDown}</div>*/}
              {/*<p><strong>4.Swap ETH for USDC</strong> with gas about $0.04</p>*/}
            </dd>
          </dl>

        </div>

        <h2>Other trading strategies:</h2>
        <p>Coming soon...</p>
      </Skeleton>
    </div>
  );
};

export default TradeToEarn;