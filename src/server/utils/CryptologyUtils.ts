import * as CryptoJS from 'crypto-js';

export class CryptologyUtils {

    public static encrypt(message: string, key: string): string {
        return CryptoJS.AES.encrypt(message, key).toString();
    }

    public static decrypt(cipherText: string, key: string): string {
        let decr = CryptoJS.AES.decrypt(cipherText, key);
        return decr.toString(CryptoJS.enc.Utf8)
    }

}