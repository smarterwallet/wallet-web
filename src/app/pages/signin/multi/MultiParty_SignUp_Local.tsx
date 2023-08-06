import HeaderBar from '../../../elements/HeaderBar';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { Collapse } from 'antd-mobile';
import SinglePartyAccount_SignUp from '../single/SinglePartyAccount_SignUp';

export default function MultiParty_SignUp_Local(props: {}) {
  return (
    <div className="px-[20px]">
      <HeaderBar text="Store in Local" />

      <div>
        <Collapse accordion defaultActiveKey="SignUp">
          <Collapse.Panel key="SignUp" title="Sign up">
            <SinglePartyAccount_SignUp
              onChange={() => {
                window.history.back();
              }}
            />
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
}
