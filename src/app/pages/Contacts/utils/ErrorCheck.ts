import {TransactionDetail} from '../index';
import { BlockChains } from './blockchainConfig';
import { IBalanceData } from './useBalance';


export const SendErrorCheck = async(transactionDetail : TransactionDetail, balanceData : IBalanceData) => {
      
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
      if(transactionDetail.amount === null || transactionDetail.amount === '' || transactionDetail.amount === undefined || isNaN(parseFloat(transactionDetail.amount?.toString()))) {
        return "Please input a correct number"
      }
      if (parseFloat(transactionDetail.amount?.toString()) > (parseFloat(balanceData[transactionDetail.token]?.toString()))) {
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
      if (!Object.keys(BlockChains).includes(transactionDetail.target)) {
        return 'Your chosen chain is unsupported.'
      }
      return null
}
