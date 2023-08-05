import { NavLink } from 'react-router-dom';
import React from 'react';
import HeaderBar from '../../../elements/HeaderBar';

export default function MultiPartyQuantityChoosePage(props: {}) {
  return (
    <div className="px-[20px]">
      <HeaderBar text="Multi-party Backup" />

      <div className="mt-16">How many login keys would you like to set?</div>
      <div className="">
        <NavLink className="welcome-page-button-container" to="/signin/singlePartyAccount">
          <div className="welcome-page-button-text">3</div>
          <img className="welcome-page-button-icon" src="/icon/arrow-right.png" />
        </NavLink>
      </div>
      <div className="px-4">At least 2 of 3 keys will be required to login smoothly</div>
    </div>
  );
}
