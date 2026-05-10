import Member          from '../models/Member.js'
import { DEFAULT_MEMBERS } from '../utils/seedData.js'

// @desc    Get all members for logged in user
// @route   GET /api/members
// @access  Private
export async function getMembers(req, res) {
  const members = await Member.find({ user: req.user._id }).sort({ createdAt: 1 })
  res.json(members)
}

// @desc    Create a new member
// @route   POST /api/members
// @access  Private
export async function createMember(req, res) {
  const { name, role, timezone, workStart, workEnd, colorIndex } = req.body

  if (!name || !role || !timezone) {
    res.status(400)
    throw new Error('Name, role and timezone are required')
  }

  const member = await Member.create({
    user:       req.user._id,
    name,
    role,
    timezone,
    workStart:  workStart  ?? '09:00',
    workEnd:    workEnd    ?? '17:00',
    colorIndex: colorIndex ?? 0,
  })

  res.status(201).json(member)
}

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Private
export async function updateMember(req, res) {
  const member = await Member.findById(req.params.id)

  if (!member) {
    res.status(404)
    throw new Error('Member not found')
  }

  // Make sure the member belongs to the logged in user
  if (member.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error('Not authorized to update this member')
  }

  const updated = await Member.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )

  res.json(updated)
}

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Private
export async function deleteMember(req, res) {
  const member = await Member.findById(req.params.id)

  if (!member) {
    res.status(404)
    throw new Error('Member not found')
  }

  if (member.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error('Not authorized to delete this member')
  }

  await member.deleteOne()
  res.json({ id: req.params.id, message: 'Member removed' })
}

// @desc    Seed default members for a new user
// @route   POST /api/members/seed
// @access  Private
export async function seedMembers(req, res) {
  // Only seed if user has no members yet
  const existing = await Member.find({ user: req.user._id })
  if (existing.length > 0) {
    res.status(400)
    throw new Error('Members already exist for this account')
  }

  const members = await Member.insertMany(
    DEFAULT_MEMBERS.map(m => ({ ...m, user: req.user._id }))
  )

  res.status(201).json(members)
}