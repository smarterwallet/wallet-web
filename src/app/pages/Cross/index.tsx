import React from 'react';
import { Global } from '../../../server/Global';
import ConfirmModal from './ConfirmModal';

type Props = {};

const Cross = (props: Props) => {
  console.log(Global.account);

  return (
    <>
      <ConfirmModal title="Sequence of operations:" transactionDetail={{}} needFooter />
    </>
  );
};

export default Cross;
