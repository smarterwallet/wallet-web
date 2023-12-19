import { BigNumber } from "@ethersproject/bignumber";
import { gasPriceQuery } from "./etherQueryMethod";
import { Global } from "../../../../server/Global";
import { BlockChainConfig } from "./blockchainConfig";

export type sameBlockChainParams = {
    BlockChain_Config: BlockChainConfig;
    amount: string | number;
    receiver: string;
    token: string;
  };
  
export const onSameBlockChainTransfer = async ({ BlockChain_Config, amount, receiver, token }: sameBlockChainParams) => {
    const gas = await gasPriceQuery(BlockChain_Config.Rpc_api);
  
    const transferDetail: [string, string, string, string, BigNumber] = [
      amount?.toString(),
      receiver,
      BlockChain_Config.ADDRESS_TOKEN_PAYMASTER,
      BlockChain_Config.ADDRESS_ENTRYPOINT,
      gas,
    ];
  
    try {
      token === 'usdc' &&
        (await Global.account.sendTxTransferERC20TokenWithUSDCPay(BlockChain_Config?.USDContact, ...transferDetail));
      token === 'swt' &&
        (await Global.account.sendTxTransferERC20Token(BlockChain_Config?.SWTContact, ...transferDetail));
    } catch (e) {
      console.error('Error in transfer', e);
    }
  };