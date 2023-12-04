import React from 'react';
import { Global } from '../../../server/Global';
import Result from './ConfirmModal';

type Props = {};

const Cross = (props: Props) => {
  console.log(Global.account);

  return (
    <>
      <Result title="Sequence of operations:" transactionDetail={{}} needFooter />
    </>
  );
};

export default Cross;
