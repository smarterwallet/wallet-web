import React from 'react';
import HeaderBar from '../elements/HeaderBar';
import { Collapse } from 'antd-mobile';
import { renderMenu } from '../util/util';

const GridStrategies = () => {
  return (
    <div className="ww-page-container">
      <HeaderBar text='Grid Strategies'/>
      <Collapse accordion defaultActiveKey="1">
        <Collapse.Panel key='1' title='Spot grid'>
          <div className="ww-content-text">
            Buy low sell high in volatile markets,
            Multi trigger types to grasp the best entry points
          </div>
          {renderMenu('', 'Config and create', '/spotGrid')}

        </Collapse.Panel>
        <Collapse.Panel key='2' title='Futures Grib'>
          Futures Grib
        </Collapse.Panel>
        <Collapse.Panel key='3' title='Infinity grid'>
          Infinity grid
        </Collapse.Panel>
        <Collapse.Panel key='4' title='Moon grid'>
          Moon grid
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default GridStrategies;