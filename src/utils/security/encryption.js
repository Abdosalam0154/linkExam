import CryptoJS from "crypto-js";

export const generateEncryption=({plaintext={},signature=process.env.SIGNATURE_TOKEN}={})=>{
    const hash =CryptoJS.AES.encrypt(plaintext,signature)
    return hash
}
export const generateDecryption=({plaintext={},signature=process.env.SIGNATURE_TOKEN}={})=>{
    const hash =CryptoJS.AES.decrypt(plaintext,signature).toString(CryptoJS.enc.Utf8)
    return hash
}