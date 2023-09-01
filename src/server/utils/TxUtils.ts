import {ethers} from "ethers";

export class TxUtils {
    public static async checkTransactionStatus(ethersProvider: ethers.providers.JsonRpcProvider,txHash: string) {
        let receipt = await ethersProvider.getTransactionReceipt(txHash);

        while (!receipt) {
            await ethersProvider.waitForTransaction(txHash);
            receipt = await ethersProvider.getTransactionReceipt(txHash);
        }
    }
}

export const ab2str = (buf: ArrayBuffer) => {
  // @ts-ignore
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
export const str2ab = (str: string) => {
  const buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}