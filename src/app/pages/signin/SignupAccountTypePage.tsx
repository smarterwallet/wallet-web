import HeaderBar from '../../elements/HeaderBar';
import { NavLink } from 'react-router-dom';
import React from 'react';
import SWCell from '../../component/SWCell';

export default function SignupAccountTypePage(props: {}) {
  return (
    <div className="px-[20px]">
      <HeaderBar text="Account Signup" />
      <div className="">Choose the type of account you want to have:</div>

      <div className="mt-16">
        <SWCell
          // icon="/icon/lock.png"
          text="Single party account"
          to="/signin/singlePartyAccount"
          shadow={true}
        />
        {/* <NavLink className="welcome-page-button-container" to="/signin/singlePartyAccount">
          <div className="welcome-page-button-text">Single party account</div>
          <img className="welcome-page-button-icon" src="/icon/arrow-right.png" />
        </NavLink> */}
      </div>

      <div className="mt-8">
        <SWCell
          // icon="/icon/lock.png"
          text="Multi party account"
          to="/signin/multi/multiPartyQuantityChoosePage"
          shadow={true}
        />
        {/* <NavLink className="welcome-page-button-container" to="/signin/multiPartyQuantityChoosePage">
          <div className="welcome-page-button-text">Multi party account</div>
          <img className="welcome-page-button-icon" src="/icon/arrow-right.png" />
        </NavLink> */}
      </div>
    </div>
  );
}
