import {TransactionDetail} from '../index';

export const SendErrorCheck = (transactionDetail : TransactionDetail, balance : string) => {
    if (transactionDetail.address === '' || transactionDetail.address === null || transactionDetail.address === undefined) {
        return "Sender can't not be empty"
      }
      if (transactionDetail.address.lastIndexOf('0x') != 0) {
        return 'This is no a ETH WALLET address syntax'
      }
      if (transactionDetail.address.length < 42) {
        return "The length of Sender's address is not a ETH WALLET address"
      }
      if (parseFloat(transactionDetail.amount as string) <  0) {
        return "The amount can't be neviage"
      }
      if (parseFloat(transactionDetail.amount as string) >  parseFloat(balance)) {
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