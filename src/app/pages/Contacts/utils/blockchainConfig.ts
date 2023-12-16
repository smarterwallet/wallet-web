// read data from json
const fujiConfig = require('../../../config/fuji.json');
const polygonMumbaiConfig = require('../../../config/mumbai.json');

// explore blockChain data
export const Fuij_Config = {
  address: localStorage.getItem('avax fujiAddress'),
  USDContact: fujiConfig.token.USDC.address,
  ADDRESS_TOKEN_PAYMASTER: fujiConfig.address.address_token_paymaster,
  ADDRESS_ENTRYPOINT: fujiConfig.address.address_entrypoint,
  Rpc_api: fujiConfig.api.rpc_api,
};

export const Mumbai_Config = {
  address: localStorage.getItem('mumbaiAddress'),
  USDContact: polygonMumbaiConfig.token.USDC.address,
  ADDRESS_TOKEN_PAYMASTER: polygonMumbaiConfig.address.address_token_paymaster,
  ADDRESS_ENTRYPOINT: polygonMumbaiConfig.address.address_entrypoint,
  Rpc_api: polygonMumbaiConfig.api.rpc_api,
};

// For Picker 
export const blockchainColumns = [
  [
    { label: 'Mumbai', value: 'mumbai' },
    { label: 'Fuji', value: 'fuji' },
  ],
];