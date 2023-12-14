import {BalanceData, TransactionDetail} from '../index';

export const SendErrorCheck = (transactionDetail : TransactionDetail, { balance } : BalanceData) => {
      if (transactionDetail.address === '' || transactionDetail.address === null || transactionDetail.address === undefined) {
        return "Sender can't not be empty"
      }
      if (transactionDetail.address.lastIndexOf('0x') !== 0) {
        return 'This is no a ETH WALLET address syntax'
      }
      if (transactionDetail.address.length < 42) {
        return "The length of Sender's address is not a ETH WALLET address"
      }
      if (parseFloat(transactionDetail.amount?.toString()) > (parseFloat(balance['fuji']?.toString()) + parseFloat(balance['mumbai']?.toString()))) {
        return "Your Wallet Balance is not enough"
      }
      if (transactionDetail.receiver === '' || transactionDetail.receiver === null || transactionDetail.receiver === undefined) {
        return "receiver can't not be empty"
      }
      if (transactionDetail.receiver.lastIndexOf('0x') != 0) {
        return 'This is no a ETH WALLET address syntax'
      }
      if (transactionDetail.receiver.length < 42) {
        return "The length of receiver's address is not a ETH WALLET address"
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