import HeaderBar from '../../../elements/HeaderBar';
import React from 'react';
import { Collapse } from 'antd';
import SinglePartyAccount_Login from './SinglePartyAccount_Login';
import SinglePartyAccount_SignUp from './SinglePartyAccount_SignUp';

export default function SinglePartyAccountPage(props: {}) {
  return (
    <div className="px-[20px]">
      <HeaderBar text="Single Party Account" />

      <div>
        <Collapse
          accordion
          className="ww-collapse"
          defaultActiveKey="SignUp"
          items={[
            {
              label: 'Sign up',
              key: 'SignUp',
              children: <SinglePartyAccount_SignUp />
            },
            {
              label: 'Login',
              key: 'Login',
              children: <SinglePartyAccount_Login />
            }
          ]}
        />
      </div>
    </div>
  );
}
