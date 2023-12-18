import React from 'react';
import HeaderBar from '../elements/HeaderBar';
import { Collapse } from 'antd';
import MenuLink from '../component/MenuLink';

const GridStrategies = () => {
  return (
    <div className="ww-page-container">
      <HeaderBar text='Grid Strategies'/>
      <Collapse
        defaultActiveKey="1"
        className="ww-collapse"
        accordion
        items={[
          {
            label: 'Spot grid',
            key: '1',
            children: (<>
              <div className="ww-content-text">
                Buy low sell high in volatile markets,
                Multi trigger types to grasp the best entry points
              </div>
              <MenuLink to="/simpleStrategy">Config and create</MenuLink>
            </>)
          },
          {
            label: 'Futures Grib',
            key: '2',
            children: 'Futures Grib'
          },
          {
            label: 'Infinity grid',
            key: '3',
            children: 'Infinity grid'
          },
          {
            label: 'Moon grid',
            key: '4',
            children: 'Moon grid'
          },
        ]}
      />
    </div>
  );
};

export default GridStrategies;