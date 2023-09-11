import React, { useState } from 'react';
import HeaderBar from '../../elements/HeaderBar';
import './styles.scss';
import { IconMicrophone } from '../Icons';
import demandsCategory from './demandsCfg';
import SwitchDemandApp from '../../component/SwitchDemandApp';

const Demand = () => {

  const [activeExtra, setActiveExtra] = useState('');

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
        <div className="txt">What else do you want?</div>
        <div className="icon-wrap">
          {IconMicrophone}
        </div>
      </div>
    </div>
  );
};

export default Demand;