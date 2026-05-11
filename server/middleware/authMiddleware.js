import jwt  from 'jsonwebtoken'
import User from '../models/User.js'

export async function protect(req, res, next) {
  let token

  // Check Authorization header first
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  // Fall back to cookie
  else if (req.cookies.synczone_token) {
    token = req.cookies.synczone_token
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized — no token')
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id).select('-password')

  if (!req.user) {
    res.status(401)
    throw new Error('Not authorized — user not found')
  }

  next()
}