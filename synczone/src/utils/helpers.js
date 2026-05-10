import { DateTime } from 'luxon'
import { AVATAR_COLORS } from '../data/mockData'

// ── TIME ──────────────────────────────────────────────────

export function getNow(timezone) {
  return DateTime.now().setZone(timezone)
}

export function formatTime(timezone) {
  return getNow(timezone).toFormat('h:mm a')
}

export function formatTimeFull(timezone) {
  return getNow(timezone).toFormat('h:mm:ss a')
}

export function formatDate(timezone) {
  return getNow(timezone).toFormat('EEE, LLL d')
}

export function formatTimezoneOffset(timezone) {
  const dt = getNow(timezone)
  return dt.toFormat('ZZZZ')
}

export function tzAbbr(timezone) {
  return getNow(timezone).toFormat('ZZZZ')
}

export function tzShortName(timezone) {
  return timezone.split('/').pop().replace(/_/g, ' ')
}

// Convert a specific UTC hour to a member's local time string
export function utcHourToLocal(utcHour, timezone) {
  const dt = DateTime.fromObject({ hour: utcHour, minute: 0 }, { zone: 'UTC' })
  return dt.setZone(timezone).toFormat('h:mm a')
}

// Convert a date+time string (local) to every member's local time
export function convertToAllZones(dateStr, timeStr, members) {
  if (!dateStr || !timeStr) return []
  const [y, mo, d] = dateStr.split('-').map(Number)
  const [h, mi]    = timeStr.split(':').map(Number)
  const utc = DateTime.fromObject(
    { year: y, month: mo, day: d, hour: h, minute: mi },
    { zone: 'UTC' }
  )
  return members.map(m => ({
    ...m,
    localDt:   utc.setZone(m.timezone),
    localTime: utc.setZone(m.timezone).toFormat('h:mm a'),
    localDate: utc.setZone(m.timezone).toFormat('EEE LLL d'),
  }))
}


// ── MEMBER STATUS ─────────────────────────────────────────

// Returns 'work' | 'overlap' | 'off'
export function getMemberStatus(member) {
  const dt = getNow(member.timezone)
  const current = dt.hour + dt.minute / 60

  const [sh, sm] = member.workStart.split(':').map(Number)
  const [eh, em] = member.workEnd.split(':').map(Number)
  const start = sh + sm / 60
  const end   = eh + em / 60

  if (current >= start && current <= end)           return 'work'
  if (current >= start - 2 && current < start)      return 'overlap'
  if (current > end && current <= end + 2)           return 'overlap'
  return 'off'
}

export function getStatusLabel(status) {
  if (status === 'work')    return 'Working'
  if (status === 'overlap') return 'Overlap hrs'
  return 'Off hours'
}

export function getStatusBadgeClass(status) {
  if (status === 'work')    return 'badge-success'
  if (status === 'overlap') return 'badge-warning'
  return 'badge-danger'
}

// Is a given UTC hour within a member's working window?
export function isWorkingAt(member, utcHour) {
  const dt = DateTime.fromObject({ hour: utcHour, minute: 0 }, { zone: 'UTC' })
  const local = dt.setZone(member.timezone)
  const current = local.hour + local.minute / 60

  const [sh, sm] = member.workStart.split(':').map(Number)
  const [eh, em] = member.workEnd.split(':').map(Number)

  return current >= sh + sm / 60 && current <= eh + em / 60
}

// Is a given UTC hour in the overlap buffer for a member?
export function isOverlapAt(member, utcHour) {
  const dt = DateTime.fromObject({ hour: utcHour, minute: 0 }, { zone: 'UTC' })
  const local = dt.setZone(member.timezone)
  const current = local.hour + local.minute / 60

  const [sh, sm] = member.workStart.split(':').map(Number)
  const [eh, em] = member.workEnd.split(':').map(Number)
  const start = sh + sm / 60
  const end   = eh + em / 60

  return (current >= start - 2 && current < start) ||
         (current > end && current <= end + 2)
}


// ── MEETING SUGGESTIONS ───────────────────────────────────

// Returns all 24 UTC hours scored by how many members are working
export function computeOverlapSlots(members) {
  return Array.from({ length: 24 }, (_, utcHour) => {
    const working = members.filter(m => isWorkingAt(m, utcHour)).length
    const overlap = members.filter(m => isOverlapAt(m, utcHour)).length
    return { utcHour, working, overlap, total: members.length }
  }).sort((a, b) => b.working - a.working || b.overlap - a.overlap)
}


// ── AVATAR ────────────────────────────────────────────────

export function getAvatarColor(colorIndex) {
  return AVATAR_COLORS[colorIndex] ?? AVATAR_COLORS[0]
}

export function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export function avatarStyle(colorIndex) {
  const c = getAvatarColor(colorIndex)
  return {
    background: c.bg,
    color:      c.text,
    border:     `1px solid ${c.border}`,
  }
}


// ── MISC ──────────────────────────────────────────────────

export function getTodayString() {
  const now = new Date()
  const y   = now.getFullYear()
  const mo  = String(now.getMonth() + 1).padStart(2, '0')
  const d   = String(now.getDate()).padStart(2, '0')
  return `${y}-${mo}-${d}`
}

export function copyToClipboard(text) {
  return navigator.clipboard?.writeText(text) ?? Promise.reject()
}

export function buildCopyText(meetingName, conversions) {
  const parts = conversions.map(c => `${c.localTime} ${tzShortName(c.timezone)}`)
  return `📅 ${meetingName}: ${parts.join(' | ')}`
}