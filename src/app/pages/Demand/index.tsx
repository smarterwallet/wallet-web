import React, { useEffect, useState } from 'react';
import HeaderBar from '../../elements/HeaderBar';
import './styles.scss';
import { IconMicrophone } from '../Icons';
import demandsCategory from './demandsCfg';
import SwitchDemandApp from '../../component/SwitchDemandApp';
import { HttpUtils } from '../../../server/utils/HttpUtils';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';

const Demand = () => {

  const [activeExtra, setActiveExtra] = useState('');
  const navigate = useNavigate();

  const inputDemand = (e: any) => {
    if(e.keyCode == 13 ||e.keyCode == 9){
      e.preventDefault();//禁止键盘默认事件
      navigate(`/tradeToEarn/${e.target.value}`)
    }
  }

  useEffect(() => {

  }, [])

  return (
    <div className="ww-page-container page-demand">
      <HeaderBar text="Demand" returnable={false}/>
      <SwitchDemandApp to="/apps"/>

      <div className="demands-wrap">
      {
        demandsCategory.map((category) => {
          return (
            <React.Fragment key={category.title}>
              <h2>{category.title}</h2>
              <ul className="demands">
                {
                  category.demands.map((demand) => {
                    return (
                      <li className="demand-item" key={demand.name}>
                        <div
                          className="demand-item-box"
                          onClick={() => {
                            setActiveExtra(activeExtra === demand.name ? '' : demand.name);
                          }}
                        >
                          <div className="icon-wrap">{demand.icon}</div>
                          <h3>{demand.name}</h3>
                        </div>
                        {
                          activeExtra === demand.name && (
                            <div className="demand-extra">{demand.extra}</div>
                          )
                        }
                      </li>
                    )
                  })
                }
              </ul>
            </React.Fragment>
          )
        })
      }
      </div>
      <div className="other-demand">
        <div className="txt">
          <Input type="text" placeholder="What else do you want?" onKeyDown={inputDemand}/>
        </div>
        {/*<div className="icon-wrap">*/}
        {/*  {IconMicrophone}*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default Demand;