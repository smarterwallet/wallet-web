import HeaderBar from '../../../elements/HeaderBar';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { Collapse } from 'antd-mobile';
import SinglePartyAccountLogin from './SinglePartyAccountLogin';

export default function SinglePartyAccountPage(props: {}) {
  return (
    <div className="px-[20px]">
      <HeaderBar text="Single Party Account" />

      <div>
        <Collapse accordion defaultActiveKey="SignUp">
          <Collapse.Panel key="SignUp" title="Sign up">
            <SinglePartyAccountLogin />
          </Collapse.Panel>
          <Collapse.Panel key="Login" title="Login">
            手风琴模式只能同时展开一个
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
}
