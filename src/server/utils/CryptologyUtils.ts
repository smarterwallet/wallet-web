import * as CryptoJS from 'crypto-js';

export class CryptologyUtils {

    public static encrypt(message: string, key: string): string {
        const cipherText = CryptoJS.AES.encrypt(message, key).toString();
        return cipherText;
    }

    public static decrypt(cipherText: string, key: string): string {
        const bytes = CryptoJS.AES.decrypt(cipherText, key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    }

}