import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import {
  getInitials,
  avatarStyle,
  isWorkingAt,
  isOverlapAt,
  computeOverlapSlots,
  utcHourToLocal,
} from '../utils/helpers'
import { DateTime } from 'luxon'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

function hourLabel(h) {
  if (h === 0)  return '12am'
  if (h === 12) return '12pm'
  return h < 12 ? `${h}am` : `${h - 12}pm`
}

export default function Timeline() {
  const { members, setActivePage, setMeetingTime } = useApp()
  const [nowPct, setNowPct]         = useState(0)
  const [tooltip, setTooltip]       = useState(null)
  const [bestSlots, setBestSlots]   = useState([])
  const blocksRef                   = useRef(null)

  // Recompute current time percentage every second
  useEffect(() => {
    function tick() {
      const utc = DateTime.now().setZone('UTC')
      setNowPct((utc.hour * 60 + utc.minute) / (24 * 60) * 100)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Recompute best slots whenever members change
  useEffect(() => {
    setBestSlots(computeOverlapSlots(members).slice(0, 5))
  }, [members])

  function getBlockType(member, utcHour) {
    if (isWorkingAt(member, utcHour))  return 'work'
    if (isOverlapAt(member, utcHour))  return 'overlap'
    return 'off'
  }

  function handleBlockHover(member, utcHour, e) {
    const rect = e.currentTarget.closest('.timeline-blocks-wrap').getBoundingClientRect()
    setTooltip({
      member,
      utcHour,
      localTime: utcHourToLocal(utcHour, member.timezone),
      type:      getBlockType(member, utcHour),
      x:         e.clientX - rect.left,
    })
  }

  const best = bestSlots[0]

  return (
    <div className="page-enter">

      <div className="dashboard-heading">
        <div>
          <h2 className="page-title">Timeline</h2>
          <p className="page-sub">24-hour overlap view across all timezones — UTC base</p>
        </div>
      </div>

      {/* Best slot banner */}
      {best && (
        <motion.div
          className="best-slot-banner"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="best-slot-banner-left">
            <div className="best-slot-star">⭐</div>
            <div>
              <div className="best-slot-label">Best meeting window right now</div>
              <div className="best-slot-time">{hourLabel(best.utcHour)} UTC</div>
            </div>
          </div>
          <div className="best-slot-members">
            {best.working} of {members.length} members working
          </div>
          <button
  className="btn btn-primary btn-sm"
  onClick={() => {
    const h = String(best.utcHour).padStart(2, '0')
    setMeetingTime(`${h}:00`)
    setActivePage('meeting')
  }}
>
  Schedule this →
</button>
        </motion.div>
      )}

      {/* Grid */}
      <div className="timeline-container mb-4">

        {/* Toolbar */}
        <div className="timeline-toolbar">
          <div style={{ flex: 1, fontSize: '13px', fontWeight: 600 }}>
            All times shown in UTC — hover any block to see local time
          </div>
          <div className="timeline-legend">
            <div className="legend-item">
              <div className="legend-swatch" style={{ background: 'rgba(52,211,153,0.25)', border: '1px solid rgba(52,211,153,0.4)' }} />
              Working hours
            </div>
            <div className="legend-item">
              <div className="legend-swatch" style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.35)' }} />
              Overlap buffer
            </div>
            <div className="legend-item">
              <div className="legend-swatch" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
              Off hours
            </div>
            <div className="legend-item">
              <div className="legend-swatch" style={{ background: 'rgba(79,110,247,0.25)', border: '1px solid rgba(79,110,247,0.5)' }} />
              Best slot
            </div>
          </div>
        </div>

        <div className="timeline-scroll-wrap">
          <div className="timeline-grid">

            {/* Hour labels */}
            <div className="timeline-hour-row">
              {HOURS.map(h => (
                <div key={h} className="hour-tick">{hourLabel(h)}</div>
              ))}
            </div>

            {/* Member rows */}
            <div style={{ position: 'relative' }} ref={blocksRef}>
              {members.map((member, mi) => (
                <motion.div
                  key={member.id}
                  className="timeline-row"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: mi * 0.04 }}
                >
                  {/* Member label */}
                  <div className="timeline-member-cell">
                    <div className="avatar avatar-sm" style={avatarStyle(member.colorIndex)}>
                      {getInitials(member.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="name">{member.name}</div>
                      <div className="tz">{member.timezone.split('/').pop().replace(/_/g, ' ')}</div>
                    </div>
                  </div>

                  {/* Blocks */}
                  <div
                    className="timeline-blocks-wrap"
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {HOURS.map(h => {
                      const type = getBlockType(member, h)
                      return (
                        <div
                          key={h}
                          className={`t-block t-block-${type}`}
                          onMouseEnter={e => handleBlockHover(member, h, e)}
                        />
                      )
                    })}

                    {/* Best slot overlay */}
                    {best && (
                      <div
                        className="best-slot-overlay"
                        style={{ left: `${(best.utcHour / 24) * 100}%`, width: `${(1 / 24) * 100}%` }}
                      />
                    )}

                    {/* Tooltip */}
                    {tooltip?.member.id === member.id && (
                      <div
                        className="block-tooltip"
                        style={{ left: `${Math.min(tooltip.x, 85)}%` }}
                      >
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {tooltip.localTime}
                        </span>
                        <span className={`badge badge-${
                          tooltip.type === 'work' ? 'success' :
                          tooltip.type === 'overlap' ? 'warning' : 'danger'
                        }`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                          {tooltip.type === 'work' ? 'Working' : tooltip.type === 'overlap' ? 'Overlap' : 'Off'}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Live time cursor */}
              <div
                className="time-cursor"
                style={{ left: `calc(190px + (100% - 190px) * ${nowPct / 100})` }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Overlap score cards */}
      <div className="section-header">
        <div className="section-title">Top Meeting Windows</div>
        <div className="section-sub">Ranked by number of members available</div>
      </div>

      <div className="overlap-slots-grid stagger">
        {bestSlots.map((slot, i) => (
          <div
            key={slot.utcHour}
            className={`overlap-slot-card card ${i === 0 ? 'overlap-slot-best' : ''}`}
          >
            <div className="overlap-slot-rank">#{i + 1}</div>
            <div className="overlap-slot-time">{hourLabel(slot.utcHour)} UTC</div>
            <div className="overlap-slot-bar-wrap">
              <div
                className="overlap-slot-bar-fill"
                style={{
                  width: `${(slot.working / slot.total) * 100}%`,
                  background: i === 0 ? 'var(--success)' : i === 1 ? 'var(--warning)' : 'var(--info)',
                }}
              />
            </div>
            <div className="overlap-slot-meta">
              {slot.working} working · {slot.overlap} overlap
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}