import HeaderBar from "../../elements/HeaderBar";
import React from "react";
import { Collapse } from 'antd';
import MenuLink from '../../component/MenuLink';

export default () => {


  return (
    <div className="ww-page-container">
      <HeaderBar text='Automatic Trading'/>
      <Collapse
        defaultActiveKey="1"
        className="ww-collapse"
        accordion
        items={[
          {
            label: 'Create a new strategy',
            key: '1',
            children: (<>
              <div className="ww-content-text">
                Design your trading strategies and create on-chain trading bots,
                and decentralized AA bundlers will execute them for you automatically.
              </div>
              <MenuLink to="/gridStrategies">Grid strategies</MenuLink>
            </>)
          },
          {
            label: 'My trading strategies',
            key: '2',
            children: (<>
              <div className="ww-content-text">
                Create trading bots based on these strategies to run them.
              </div>
              <MenuLink to="/simpleStrategy">Spot Grid</MenuLink>
            </>)
          },
        ]}
      />
    </div>
  )
}
