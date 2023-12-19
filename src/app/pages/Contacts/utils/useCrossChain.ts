import { TransactionDetail as CrossTransactionDetail } from '../../../types';
import { useState } from 'react';
import { CrossFee } from './etherQueryMethod';

const initialCrossDatail: CrossTransactionDetail = {
    receiver: '',
    amount: '',
    fees: '',
  }; 

type CrossChainHookResult = [
    isCross: boolean,
    crossDetail: CrossTransactionDetail,
    crossChain: ({ receiver, amount, source, target, token} : CrossTransactionDetail) => void
  ]
  
export const useCrossChain = () : CrossChainHookResult => {
    const [isCross, setisCross] = useState(false);
    const [crossDetial, setCrossDetail] = useState<CrossTransactionDetail>(initialCrossDatail);
  
    async function crossChain({receiver, amount, source, target, token} : CrossTransactionDetail) {
      console.log('Cross');
            const fees = await CrossFee();
            const _CrossDetial = {
              receiver,
              amount,
              source: source ,
              target: target ,
              token: token ,
              fees,
            };
            setCrossDetail(_CrossDetial);
            console.log('Cross Datial:', crossDetial);
            /// infoMessageBox('starting cross transfer')
            // 使用Cross组件
            setisCross(true);
    }
  
     return [isCross, crossDetial,crossChain]
  }