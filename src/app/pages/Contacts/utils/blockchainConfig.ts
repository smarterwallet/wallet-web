// read data from json
const fujiConfig = require('../../../config/fuji.json');
const polygonMumbaiConfig = require('../../../config/mumbai.json');

export interface BlockChainConfig {
  address: string,
  USDContact: any,
  ADDRESS_TOKEN_PAYMASTER: any,
  ADDRESS_ENTRYPOINT: any,
  Rpc_api: any
}

// explore blockChain data
const Fuij_Config : BlockChainConfig = {
  address: localStorage.getItem('avax fujiAddress'),
  USDContact: fujiConfig.token.USDC.address,
  ADDRESS_TOKEN_PAYMASTER: fujiConfig.address.address_token_paymaster,
  ADDRESS_ENTRYPOINT: fujiConfig.address.address_entrypoint,
  Rpc_api: fujiConfig.api.rpc_api,
};

const Mumbai_Config : BlockChainConfig = {
  address: localStorage.getItem('mumbaiAddress'),
  USDContact: polygonMumbaiConfig.token.USDC.address,
  ADDRESS_TOKEN_PAYMASTER: polygonMumbaiConfig.address.address_token_paymaster,
  ADDRESS_ENTRYPOINT: polygonMumbaiConfig.address.address_entrypoint,
  Rpc_api: polygonMumbaiConfig.api.rpc_api,
};

export const BlockChains = {
  'mumbai': Mumbai_Config,
  'fuji': Fuij_Config,
}

// For Picker 
export const blockchainColumns = [
  [
    { label: 'Mumbai', value: 'mumbai' },
    { label: 'Fuji', value: 'fuji' },
  ],
];