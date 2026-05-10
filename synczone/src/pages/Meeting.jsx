import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import {
  getInitials,
  avatarStyle,
  computeOverlapSlots,
  convertToAllZones,
  isWorkingAt,
  buildCopyText,
  copyToClipboard,
  getTodayString,
} from '../utils/helpers'
import { useToast } from '../components/ui/Toast'

function hourLabel(h) {
  if (h === 0)  return '12:00 AM'
  if (h === 12) return '12:00 PM'
  return h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`
}

export default function Meeting() {
  const { members, meetingName, setMeetingName,
          meetingDate, setMeetingDate,
          meetingTime, setMeetingTime } = useApp()
  const toast = useToast()

  const [copied, setCopied] = useState(false)

  const bestSlots = useMemo(
    () => computeOverlapSlots(members).slice(0, 3),
    [members]
  )

  const conversions = useMemo(
    () => convertToAllZones(meetingDate, meetingTime, members),
    [meetingDate, meetingTime, members]
  )

  const utcHour = meetingTime ? parseInt(meetingTime.split(':')[0]) : 0

  const allAvailable = conversions.length > 0 &&
    conversions.every(c => isWorkingAt(c, utcHour))

  const someUnavailable = conversions.some(c => !isWorkingAt(c, utcHour))

  function applySuggestion(slot) {
    const h = String(slot.utcHour).padStart(2, '0')
    setMeetingTime(`${h}:00`)
  }

  async function handleCopy() {
    const text = buildCopyText(meetingName, conversions)
    try {
      await copyToClipboard(text)
      setCopied(true)
      toast('Meeting times copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast('Could not access clipboard', 'error')
    }
  }

  return (
    <div className="page-enter">

      <div className="dashboard-heading">
        <div>
          <h2 className="page-title">Schedule Meeting</h2>
          <p className="page-sub">Pick a time and instantly see it across every timezone.</p>
        </div>
      </div>

      <div className="meeting-layout">

        {/* ── LEFT PANEL ── */}
        <div className="flex-col gap-3">

          {/* Meeting details */}
          <div className="card meeting-panel">
            <div className="meeting-panel-title">Meeting Details</div>

            <div className="input-group">
              <label className="input-label">Meeting Name</label>
              <input
                className="input"
                placeholder="e.g. Weekly Standup"
                value={meetingName}
                onChange={e => setMeetingName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Date</label>
              <input
                className="input"
                type="date"
                value={meetingDate}
                min={getTodayString()}
                onChange={e => setMeetingDate(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Time (UTC)</label>
              <input
                className="input"
                type="time"
                value={meetingTime}
                onChange={e => setMeetingTime(e.target.value)}
              />
            </div>
          </div>

          {/* AI suggestions */}
          <div className="card meeting-panel">
            <div className="meeting-panel-title">
              Suggested Windows
              <span className="meeting-panel-badge">AI</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Ranked by maximum team availability
            </p>

            {bestSlots.map((slot, i) => (
              <motion.div
                key={slot.utcHour}
                className={`suggest-slot ${i === 0 ? 'suggest-slot-best' : ''}`}
                onClick={() => applySuggestion(slot)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
              >
                <div className="suggest-slot-header">
                  <div className="suggest-slot-time">
                    {hourLabel(slot.utcHour)}
                    <span className="suggest-slot-utc">UTC</span>
                  </div>
                  {i === 0 && (
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>
                      Best
                    </span>
                  )}
                  {i === 1 && (
                    <span className="badge badge-warning" style={{ fontSize: '10px' }}>
                      Good
                    </span>
                  )}
                </div>

                <div className="suggest-slot-bar-wrap">
                  <div
                    className="suggest-slot-bar-fill"
                    style={{
                      width:      `${(slot.working / slot.total) * 100}%`,
                      background: i === 0 ? 'var(--success)' : i === 1 ? 'var(--warning)' : 'var(--info)',
                    }}
                  />
                </div>

                <div className="suggest-slot-meta">
                  <span>{slot.working} of {slot.total} available</span>
                  {slot.overlap > 0 && (
                    <span style={{ color: 'var(--warning)' }}>+{slot.overlap} overlap</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="card meeting-panel">

          <div className="meeting-results-header">
            <div>
              <div className="meeting-panel-title" style={{ marginBottom: '2px' }}>
                All Timezones
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {conversions.length > 0 && (
                  allAvailable
                    ? '✓ All members available'
                    : someUnavailable
                    ? '⚠ Some members outside working hours'
                    : ''
                )}
              </div>
            </div>

            <button
              className={`btn ${copied ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              onClick={handleCopy}
              disabled={conversions.length === 0}
            >
              {copied ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy All
                </>
              )}
            </button>
          </div>

          <div className="divider" />

          {/* Conversion rows */}
          <div className="conversion-list">
            {conversions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                Select a date and time to see conversions
              </div>
            ) : (
              conversions.map((c, i) => {
                const available = isWorkingAt(c, utcHour)
                return (
                  <motion.div
                    key={c.id}
                    className="conversion-row"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.04 }}
                  >
                    <div className="avatar avatar-sm" style={avatarStyle(c.colorIndex)}>
                      {getInitials(c.name)}
                    </div>

                    <div className="conversion-member-info">
                      <div className="conversion-member-name">{c.name}</div>
                      <div className="conversion-member-tz">
                        {c.timezone.split('/').pop().replace(/_/g, ' ')}
                      </div>
                    </div>

                    <div className="conversion-time-block">
                      <div
                        className="conversion-time"
                        style={{ color: available ? 'var(--success)' : 'var(--text-secondary)' }}
                      >
                        {c.localTime}
                      </div>
                      <div className="conversion-date">{c.localDate}</div>
                      {!available && (
                        <div className="conversion-warn">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9"  x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          Outside working hours
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>

          {/* Copy preview */}
          {conversions.length > 0 && (
            <div className="copy-preview">
              <div className="copy-preview-label">Copy preview</div>
              <div className="copy-preview-text">
                📅 {meetingName}: {conversions.map(c =>
                  `${c.localTime} ${c.timezone.split('/').pop().replace(/_/g, ' ')}`
                ).join(' | ')}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}