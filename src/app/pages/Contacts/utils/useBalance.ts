import { useEffect, useState } from 'react';
import { Global } from '../../../../server/Global';
import { Config } from '../../../../server/config/Config';
import { BigNumber } from '@ethersproject/bignumber';

export interface IBalanceData {
  [key: string]: BigNumber;
}

export const useBalance = () => {
  const [balanceData, setBalanceData] = useState<IBalanceData>({});

  useEffect(() => {
    const fetchBalance = async () => {
      let finalBalanceData = {};
      try {
        for (let key in Config.TOKENS) {
          if (Config.TOKENS[key] !== undefined && Config.TOKENS[key] !== null) {
            const blockchain = Config.TOKENS[key].name;
            console.log(blockchain);

            const balance = await Global.account.getBalanceOf(Config.TOKENS[key]);
            console.log(balance);

            finalBalanceData = { ...finalBalanceData, [blockchain?.toLocaleLowerCase()]: balance };
          }
        }
        console.log(finalBalanceData);

        setBalanceData(finalBalanceData);
      } catch (e) {
        console.error('fetch Balance is: ', e);
      }
    };

    fetchBalance();
  }, []);

  return [balanceData];
};
