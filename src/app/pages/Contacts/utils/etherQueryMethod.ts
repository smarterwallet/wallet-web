import { ethers } from 'ethers';
import { Global } from '../../../../server/Global';
// for sendTxTransferERC20Token(..., Gas)
export const gasPriceQuery = async (rpc_api: string) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpc_api);
      const GasPrice = await provider.getGasPrice();
      return GasPrice;
    } catch (e) {
      console.error(e);
    }
  };
  
  // for balance
  export const erc20BalanceQuery = async (rpc_api: string, tokenAddress: string, walletAddress: string) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpc_api);
      const erc20Contract = new ethers.Contract(
        tokenAddress,
        ['function balanceOf(address) view returns (uint256)'],
        provider,
      );
      const balance = await erc20Contract.balanceOf(walletAddress);
      const formattedBalance = ethers.utils.formatUnits(balance, 6);
      return formattedBalance;
    } catch (e) {
      console.error(e);
    }
  };
// Cross fee
export const CrossFee = async() => +ethers.utils.formatUnits((await Global.account.ethersProvider.getFeeData()).maxPriorityFeePerGas, 'ether') *
5000 *
2000;