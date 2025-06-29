import cors from 'cors'
import express from 'express'
import session from 'express-session'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth'
import providersRouter from './routes/providers'
import accountsRouter from './routes/accounts'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json())

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not set in environment variables')
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    },
  })
)

// API-Routen
app.use(authRoutes)
app.use('/providers', providersRouter)
app.use('/accounts', accountsRouter)

// frontend
const publicPath = path.resolve('public')
app.use(express.static(publicPath))

// spa fallback for react-router
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
