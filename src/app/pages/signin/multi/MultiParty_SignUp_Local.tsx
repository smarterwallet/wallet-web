import HeaderBar from '../../../elements/HeaderBar';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { Collapse } from 'antd';
import SinglePartyAccount_SignUp from '../single/SinglePartyAccount_SignUp';

export default function MultiParty_SignUp_Local(props: {}) {
  return (
    <div className="px-[20px]">
      <HeaderBar text="Store in Local" />

      <div>
        <Collapse
          accordion
          defaultActiveKey="SignUp"
          items={[
            {
              label: 'Sign up',
              key: 'SignUp',
              children: (
                <SinglePartyAccount_SignUp
                  onChange={() => {
                    window.history.back();
                  }}
                />
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
