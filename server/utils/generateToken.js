import jwt from 'jsonwebtoken'

export default function generateToken(res, userId) {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  )

  res.cookie('synczone_token', token, {
    httpOnly: true,
    secure:   false,
    sameSite: 'lax',
    maxAge:   7 * 24 * 60 * 60 * 1000,
    path:     '/',
  })

  return token
}