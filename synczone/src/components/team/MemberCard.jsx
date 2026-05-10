import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  getInitials,
  avatarStyle,
  formatTimeFull,
  formatDate,
  getMemberStatus,
  getStatusLabel,
  getStatusBadgeClass,
  tzAbbr,
} from '../../utils/helpers'

export default function MemberCard({ member, index }) {
  const [time, setTime] = useState(formatTimeFull(member.timezone))

  useEffect(() => {
    const tick = setInterval(() => {
      setTime(formatTimeFull(member.timezone))
    }, 1000)
    return () => clearInterval(tick)
  }, [member.timezone])

  const status      = getMemberStatus(member)
  const badgeClass  = getStatusBadgeClass(status)
  const color       = avatarStyle(member.colorIndex)

  return (
    <motion.div
      className="card card-hover member-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
      style={{ '--member-glow': color.background }}
    >
      {/* Header */}
      <div className="member-card-header">
        <div className="avatar avatar-lg" style={color}>
          {getInitials(member.name)}
        </div>

        <div className="member-card-meta">
          <div className="member-card-name">{member.name}</div>
          <div className="member-card-role">{member.role}</div>
          <div className="member-card-tz">{member.timezone}</div>
        </div>

        <div className={`badge ${badgeClass}`}>
          <span className="badge-dot-pulse" />
          {getStatusLabel(status)}
        </div>
      </div>

      {/* Live clock */}
      <div className="member-time-display">{time}</div>

      {/* Footer row */}
      <div className="member-date-line">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity=".5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="16" y1="2" x2="16" y2="6" />
        </svg>
        {formatDate(member.timezone)}

        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
          {tzAbbr(member.timezone)}
        </span>

        <span style={{ color: 'var(--text-muted)' }}>
          · {member.workStart}–{member.workEnd}
        </span>
      </div>

      {/* Accent bar */}
      <div
        className="member-card-accent"
        style={{ background: `linear-gradient(90deg, ${color.color}, transparent)` }}
      />
    </motion.div>
  )
}