import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const algorithm = 'aes-256-cbc'
const secret = process.env.ENCRYPTION_SECRET!

if (!secret || secret.length !== 32) {
  throw new Error("ENCRYPTION_SECRET must be 32 characters long")
}

const ivLength = 16

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(ivLength)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt(text: string): string {
  const parts = text.split(':')
  const iv = Buffer.from(parts[0], 'hex')
  const encryptedText = Buffer.from(parts[1], 'hex')
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
