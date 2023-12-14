import {BalanceData, TransactionDetail,erc20BalanceQuery,Mumbai_Config,Fuij_Config} from '../index';

const walletBalnaceObj = {
  fuji_balance: '',
  mumbai_balance: ''
}

const fetchBalance = async () => {
  try {
    const _mumbai_balance = await erc20BalanceQuery(
      Mumbai_Config.Rpc_api,
      Mumbai_Config.USDContact,
      Mumbai_Config.address,
    );
    const _fuji_balance = await erc20BalanceQuery(
      Fuij_Config.Rpc_api,
      Fuij_Config.USDContact,
      Fuij_Config.address);
    // console.log('mumbai balance', mumbai_balance);
    // console.log('fuji balance', fuji_balance);
    return [_mumbai_balance,_fuji_balance]
  } catch (e) {
    console.error('fetchBalance error is: ', e);
  }
};

export const SendErrorCheck = async(transactionDetail : TransactionDetail, { balance } : BalanceData) => {
      let time = 0;
      walletBalnaceObj.fuji_balance = balance['fuji']?.toString() ?? '';
      walletBalnaceObj.mumbai_balance = balance['mumbai']?.toString() ?? '';

      while(walletBalnaceObj.fuji_balance === '' || walletBalnaceObj.mumbai_balance === '') {
        while(isNaN(parseFloat(walletBalnaceObj.fuji_balance) + parseFloat(walletBalnaceObj.mumbai_balance)) || time !== 3) {
          const [_mumbai_balance, _fuji_balance] = await fetchBalance();
          walletBalnaceObj.fuji_balance = _fuji_balance?.toString();
          walletBalnaceObj.mumbai_balance = _mumbai_balance?.toString();
          time ++;
        }
        if(time === 3) return 'Balance fetch fauiled.';
      }
  
      if (transactionDetail.address === '' || transactionDetail.address === null || transactionDetail.address === undefined) {
        return "Sender can't not be empty"
      }
      if (transactionDetail.address.lastIndexOf('0x') !== 0) {
        return 'This is no an ETH WALLET address syntax'
      }
      if (transactionDetail.address.length < 42) {
        return "The length of Sender's address is not a ETH WALLET address"
      }
      if(transactionDetail.token === '' || transactionDetail.token === null || transactionDetail.token === undefined) {
        return "You must choose a token for Transfer"
      }
      if(transactionDetail.amount?.toString() === null || transactionDetail.amount?.toString() === '' || transactionDetail.amount?.toString() === undefined || isNaN(parseFloat(transactionDetail.amount?.toString()))) {
        return "Please input a correct number"
      }
      if (parseFloat(transactionDetail.amount?.toString()) > (parseFloat(walletBalnaceObj.fuji_balance) + parseFloat(walletBalnaceObj.mumbai_balance))) {
        return "Your Wallet Balance is not enough"
      }
      if (transactionDetail.receiver === '' || transactionDetail.receiver === null || transactionDetail.receiver === undefined) {
        return "receiver can't not be empty"
      }
      if (transactionDetail.receiver.lastIndexOf('0x') != 0) {
        return 'This is no an ETH WALLET address syntax'
      }
      if (transactionDetail.receiver.length < 42) {
        return "The length of receiver's address is not an ETH WALLET address"
      }
      if (transactionDetail.target?.toString() === '' || transactionDetail.target === null || transactionDetail.target === undefined) {
        return 'You must choose a target blockchain'
      }
      if (transactionDetail.target !== 'Fuji'.toLowerCase() && transactionDetail.target !== 'Mumbai'.toLowerCase()) {
        return 'only support Fuji and Mumbai blockchain'
      }
      return null
}

// const epsilon = 0.00000001; // 设置一个较小的误差范围
//       const amount = parseFloat(transactionDetail.amount.toString());
//       const fujiBalance = balance['fuji'];
//       const mumbaiBalance = balance['mumbai'];

//       const totalBalance = parseFloat(fujiBalance.toString()) + parseFloat(mumbaiBalance.toString());
//       if(!isNaN(amount) && !isNaN(totalBalance)) {
//         const isLarge = Math.abs(amount - totalBalance) > epsilon;

//         console.log(isLarge);
//       } else {
//         console.log(isNaN(amount));
//         console.log(isNaN(totalBalance));
//       }