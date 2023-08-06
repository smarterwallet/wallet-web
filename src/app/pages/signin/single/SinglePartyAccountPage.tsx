import HeaderBar from '../../../elements/HeaderBar';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { Collapse } from 'antd-mobile';
import SinglePartyAccount_Login from './SinglePartyAccount_Login';
import SinglePartyAccount_SignUp from './SinglePartyAccount_SignUp';

export default function SinglePartyAccountPage(props: {}) {
  return (
    <div className="px-[20px]">
      <HeaderBar text="Single Party Account" />

      <div>
        <Collapse accordion defaultActiveKey="SignUp">
          <Collapse.Panel key="SignUp" title="Sign up">
            <SinglePartyAccount_SignUp />
          </Collapse.Panel>
          <Collapse.Panel key="Login" title="Login">
            <SinglePartyAccount_Login />
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
}
