import HeaderBar from "../elements/HeaderBar";
import React from "react";
import { NavLink } from 'react-router-dom';
import { Collapse } from 'antd-mobile';
import { renderMenu } from '../util/util';

export default () => {


  return (
    <div style={{marginLeft: 20}}>
      <HeaderBar text='Automatic Trading'/>
      <Collapse accordion defaultActiveKey="1">
        <Collapse.Panel key='1' title='Create a new strategy'>
          <div className="ww-content-text">
            Design your trading strategies and create on-chain trading bots,
            and decentralized AA bundlers will execute them for you automatically.
          </div>
          {renderMenu('', 'Grid strategies', '/gridStrategies')}

        </Collapse.Panel>
        <Collapse.Panel key='2' title='My trading strategies'>
          <div className="ww-content-text">
            Create trading bots based on these strategies to run them.
          </div>
          {renderMenu('', 'Spot Grid', '/spotGrid')}
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}
