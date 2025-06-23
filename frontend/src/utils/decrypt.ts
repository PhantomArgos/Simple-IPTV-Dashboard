import CryptoJS from 'crypto-js'

const key = import.meta.env.VITE_ENCRYPTION_KEY

export function decrypt(encrypted: string): string {
  const [ivHex, encHex] = encrypted.split(':')
  const iv = CryptoJS.enc.Hex.parse(ivHex)
  const encryptedText = CryptoJS.enc.Hex.parse(encHex)
  const encryptedBase64 = CryptoJS.enc.Base64.stringify(encryptedText)

  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, CryptoJS.enc.Utf8.parse(key), {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  return decrypted.toString(CryptoJS.enc.Utf8)
}
