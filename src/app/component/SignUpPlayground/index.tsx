import HeaderBar from '../../elements/HeaderBar'
import { Collapse } from 'antd';
import React, { useState, useEffect } from 'react';
import SinglePartyAccount from './SingleParty';
import MultiPartyAccount from './MultiParty';
import './style.scss'; 
import SignupTab from './SignupTab';

const SignUpPlayground = () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  
  return (
    <div className='ww-page-container'>
      <HeaderBar text="Sign up" />
      <Collapse 
        className='ww-collapse'
        defaultActiveKey='1'
        activeKey={activeKey}
        accordion
        onChange={(key: any) => setActiveKey(key as string)}
        items={[
          {
            label: (<SignupTab text="Sing-party account" iconPath='/icon/user.png'/>),
            key: '1',
            children: (<SinglePartyAccount />),

          },
          {
            label: (<SignupTab text="Multi-party account" iconPath='/icon/social.png'/>),
            key: '2',
            children: (<MultiPartyAccount />)
          },
          
        ]}
      />
      {activeKey === '1' &&   
        <div className='multi-party-description'>  
          Provide additional verification and backup via third-party for a higher level of security  
        </div>  
      }  

      
    </div>
  )  
}

export default SignUpPlayground;