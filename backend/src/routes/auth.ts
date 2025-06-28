import { Router } from 'express'

const router = Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
    req.session.authenticated = true
    res.json({ success: true })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.json({ success: true })
  })
})

router.get('/me', (req, res) => {
  res.json({ authenticated: !!req.session.authenticated })
})

export default router
