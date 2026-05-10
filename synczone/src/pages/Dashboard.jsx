import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import MemberCard from '../components/team/MemberCard'
import { getMemberStatus, computeOverlapSlots } from '../utils/helpers'

export default function Dashboard() {
  const { members, openAddModal } = useApp()

  const available = useMemo(
    () => members.filter(m => getMemberStatus(m) === 'work').length,
    [members]
  )

  const regions = useMemo(
    () => new Set(members.map(m => m.timezone.split('/')[0])).size,
    [members]
  )

  const uniqueZones = useMemo(
    () => new Set(members.map(m => m.timezone)).size,
    [members]
  )

  const bestSlot = useMemo(() => {
    const slots = computeOverlapSlots(members)
    if (!slots.length) return '—'
    const h = slots[0].utcHour
    const ampm = h >= 12 ? 'pm' : 'am'
    return `${h % 12 || 12}${ampm} UTC`
  }, [members])

  const stats = [
    {
      label:    'Team Members',
      value:    members.length,
      sub:      `Across ${regions} regions`,
      color:    'var(--brand)',
      glow:     'rgba(79,110,247,0.15)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" opacity=".5" />
          <path d="M21 21v-2a4 4 0 0 0-3-3.85" opacity=".5" />
        </svg>
      ),
    },
    {
      label:    'Available Now',
      value:    available,
      sub:      'Currently in work hours',
      color:    'var(--success)',
      glow:     'rgba(52,211,153,0.15)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label:    'Time Zones',
      value:    uniqueZones,
      sub:      'Unique zones covered',
      color:    'var(--accent-purple)',
      glow:     'rgba(155,109,247,0.15)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      label:    'Best Meeting',
      value:    bestSlot,
      sub:      'Max overlap window',
      color:    'var(--accent-amber)',
      glow:     'rgba(251,191,36,0.15)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="3"  y1="10" x2="21" y2="10" />
          <line x1="8"  y1="2"  x2="8"  y2="6"  />
          <line x1="16" y1="2"  x2="16" y2="6"  />
        </svg>
      ),
    },
  ]

  return (
    <div className="page-enter">

      {/* Page heading */}
      <div className="dashboard-heading">
        <div>
          <h2 className="page-title">Good to see you 👋</h2>
          <p className="page-sub">Here's what's happening across your team right now.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5"  y1="12" x2="19" y2="12" />
          </svg>
          Add Member
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid-stat mb-4 stagger">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="card stat-card"
            style={{ '--glow-color': stat.glow }}
          >
            <div className="stat-card-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Members section */}
      <div className="section-header">
        <div>
          <div className="section-title">Team Live View</div>
          <div className="section-sub">Clocks update every second</div>
        </div>
      </div>

      {members.length === 0 ? (
        <EmptyState onAdd={openAddModal} />
      ) : (
        <div className="grid-auto">
          {members.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>
      )}

    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="empty-state-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="16" y1="11" x2="22" y2="11" />
        </svg>
      </div>
      <h3>No team members yet</h3>
      <p>Add your first team member to get started.</p>
      <button className="btn btn-primary mt-3" onClick={onAdd}>
        Add your first member
      </button>
    </motion.div>
  )
}