import React from 'react';
import ConfirmModal from './ConfirmModal';
import { TransactionDetail } from '../../types';

/**
 *
 * @param transactionDetail TransactionDetail
 * @returns Cross
 * @dev transactionDetail中的 fees 通过如下方式计算得到:
 * const fees = + ethers.utils.formatUnits((await Global.account.ethersProvider.getFeeData()).maxPriorityFeePerGas, 'ether') * 5000 * 2000;
 * 判断如果满足跨链发起条件，则构造transactionDetail，显示 Cross 组件 。
 * eg: {isCross && <Cross transactionDetail={transactionDetail}/>}
 */
const Cross = (transactionDetail: TransactionDetail) => {
  return (
    <>
      <ConfirmModal title="Sequence of operations:" transactionDetail={transactionDetail} needFooter />
    </>
  );
};

export default Cross;
