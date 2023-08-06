import { NavLink } from 'react-router-dom';
import React from 'react';
import HeaderBar from '../../../elements/HeaderBar';
import SWCell from '../../../component/SWCell';

export default function MultiPartyBackupKeysPage(props: {}) {
  return (
    <div className="px-[20px]">
      <HeaderBar text="3 Backup Keys" />

      <div className="text-2xl">Set up your backup keys:</div>
      <div className="mt-4">
        <SWCell text="1st login key:" to="/signin/multi/multiPartyChooseStorePage?step=1" shadow={true} />
      </div>
      <div className="mt-4">
        <SWCell text="2nd login key:" to="/signin/multi/multiPartyChooseStorePage?step=2" shadow={true} />
      </div>
      <div className="mt-4">
        <SWCell text="3rd login key:" to="/signin/multi/multiPartyChooseStorePage?step=3" shadow={true} />
      </div>
    </div>
  );
}
