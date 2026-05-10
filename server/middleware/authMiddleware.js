import jwt  from 'jsonwebtoken'
import User from '../models/User.js'

export async function protect(req, res, next) {
  const token = req.cookies.synczone_token

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