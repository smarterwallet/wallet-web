import { NavLink } from 'react-router-dom';
import React from 'react';
import HeaderBar from '../../../elements/HeaderBar';
import SWCell from '../../../component/SWCell';

export default function MultiPartyQuantityChoosePage(props: {}) {
  return (
    <div className="px-[20px]">
      <HeaderBar text="Multi-party Backup" />

      <div className="text-2xl">How many login keys would you like to set?</div>
      <div className="mt-4">
        <SWCell text="3" to="/signin/multi/multiPartyBackupKeysPage" shadow={true} />
      </div>
      <div className="mt-4 px-4">At least 2 of 3 keys will be required to login smoothly</div>
    </div>
  );
}
