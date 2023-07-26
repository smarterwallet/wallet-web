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