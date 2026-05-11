import bcrypt        from 'bcryptjs'
import User          from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export async function register(req, res) {
  const { name, email, password, timezone, colorIndex, isDemo } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please provide name, email and password')
  }

  const exists = await User.findOne({ email })
  if (exists) {
    res.status(400)
    throw new Error('An account with that email already exists')
  }

  const salt           = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    password:   hashedPassword,
    timezone:   timezone   ?? 'UTC',
    colorIndex: colorIndex ?? 0,
    isDemo:     isDemo     ?? false,
  })

  const token = generateToken(res, user._id)

  res.status(201).json({
    _id:        user._id,
    name:       user.name,
    email:      user.email,
    timezone:   user.timezone,
    colorIndex: user.colorIndex,
    isDemo:     user.isDemo,
    token
  })
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide email and password')
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  const token = generateToken(res, user._id)

  res.json({
    _id:        user._id,
    name:       user.name,
    email:      user.email,
    timezone:   user.timezone,
    colorIndex: user.colorIndex,
    isDemo:     user.isDemo,
    token
  })
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export async function logout(req, res) {
  res.cookie('synczone_token', '', {
    httpOnly: true,
    expires:  new Date(0),
  })
  res.json({ message: 'Logged out successfully' })
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export async function getMe(req, res) {
  const user = await User.findById(req.user._id)
  res.json({
    _id:        user._id,
    name:       user.name,
    email:      user.email,
    timezone:   user.timezone,
    colorIndex: user.colorIndex,
    isDemo:     user.isDemo,
  })
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export async function updateProfile(req, res) {
  const user = await User.findById(req.user._id)

  user.name       = req.body.name       ?? user.name
  user.email      = req.body.email      ?? user.email
  user.timezone   = req.body.timezone   ?? user.timezone
  user.colorIndex = req.body.colorIndex ?? user.colorIndex

  if (req.body.password) {
    const salt    = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(req.body.password, salt)
  }

  const updated = await user.save()

  res.json({
    _id:        updated._id,
    name:       updated.name,
    email:      updated.email,
    timezone:   updated.timezone,
    colorIndex: updated.colorIndex,
  })
}