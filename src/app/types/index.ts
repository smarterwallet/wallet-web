export type CurrencyType = 'Matic' | 'ETH';

export type TransactionDetail = {
  receiver?: string; // 接受人地址
  amount?: number | string; // 数量
  source?: 'mumbai' | 'fuji'; // 发起交易的链
  target?: 'mumbai' | 'fuji'; // 接收交易的链
  token?: 'usdc' | 'USDC'; // 代币种类
  fees?: string | number; // 预估交易费
};
