import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useToast } from '../components/ui/Toast'
import { updateProfile } from '../utils/authApi'
import { TIMEZONES, AVATAR_COLORS } from '../data/mockData'
import { getInitials, avatarStyle } from '../utils/helpers'

export default function Settings() {
  const { currentUser, setCurrentUser, toggleTheme, theme } = useApp()
  const toast = useToast()

  const [form, setForm] = useState({
    name:       currentUser?.name       ?? '',
    email:      currentUser?.email      ?? '',
    timezone:   currentUser?.timezone   ?? 'UTC',
    colorIndex: currentUser?.colorIndex ?? 0,
  })

  const [passwords, setPasswords] = useState({
    current:  '',
    next:     '',
    confirm:  '',
  })

  const [showPasswords, setShowPasswords] = useState(false)
  const [profileLoading,  setProfileLoading]  = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function setPasswordField(field, value) {
    setPasswords(prev => ({ ...prev, [field]: value }))
  }

  async function handleProfileSave() {
    setProfileLoading(true)
    try {
      const updated = await updateProfile({
        name:       form.name,
        email:      form.email,
        timezone:   form.timezone,
        colorIndex: form.colorIndex,
      })
      setCurrentUser(updated)
      toast('Profile updated successfully')
    } catch (err) {
      toast(err.response?.data?.message ?? 'Failed to update profile', 'error')
    } finally {
      setProfileLoading(false)
    }
  }

  async function handlePasswordSave() {
    if (!passwords.next || !passwords.confirm) {
      toast('Please fill in all password fields', 'error')
      return
    }
    if (passwords.next !== passwords.confirm) {
      toast('Passwords do not match', 'error')
      return
    }
    if (passwords.next.length < 6) {
      toast('Password must be at least 6 characters', 'error')
      return
    }
    setPasswordLoading(true)
    try {
      await updateProfile({ password: passwords.next })
      setPasswords({ current: '', next: '', confirm: '' })
      toast('Password updated successfully')
    } catch (err) {
      toast(err.response?.data?.message ?? 'Failed to update password', 'error')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="page-enter">
      <div className="dashboard-heading">
        <div>
          <h2 className="page-title">Settings</h2>
          <p className="page-sub">Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-layout">

        {/* Left column */}
        <div className="flex-col gap-3">

          {/* Profile card */}
          <motion.div
            className="card settings-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="settings-panel-title">Profile</div>

            {/* Avatar preview */}
            <div className="settings-avatar-row">
              <div className="avatar avatar-xl" style={avatarStyle(form.colorIndex)}>
                {getInitials(form.name || currentUser?.name || '?')}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
                  {form.name || 'Your Name'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {form.email}
                </div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {form.timezone}
                </div>
              </div>
            </div>

            <div className="divider" />

            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                className="input"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Your Timezone</label>
              <select
                className="select"
                value={form.timezone}
                onChange={e => setField('timezone', e.target.value)}
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label className="input-label">Avatar Color</label>
              <div className="color-picker">
                {AVATAR_COLORS.map((c, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`color-swatch ${form.colorIndex === i ? 'active' : ''}`}
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}
                    onClick={() => setField('colorIndex', i)}
                  >
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: c.text }} />
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary w-full"
              onClick={handleProfileSave}
              disabled={profileLoading}
            >
              {profileLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </motion.div>

          {/* Password card */}
          <motion.div
            className="card settings-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="settings-panel-title">Change Password</div>

            <div className="input-group">
              <label className="input-label">New Password</label>
              <div className="password-input-wrap">
                <input
                  className="input"
                  type={showPasswords ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={passwords.next}
                  onChange={e => setPasswordField('next', e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswords(p => !p)}
                >
                  {showPasswords ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label className="input-label">Confirm New Password</label>
              <div className="password-input-wrap">
                <input
                  className="input"
                  type={showPasswords ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={passwords.confirm}
                  onChange={e => setPasswordField('confirm', e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn-primary w-full"
              onClick={handlePasswordSave}
              disabled={passwordLoading}
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </motion.div>

        </div>

        {/* Right column */}
        <div className="flex-col gap-3">

          {/* Appearance */}
          <motion.div
            className="card settings-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <div className="settings-panel-title">Appearance</div>

            <div className="settings-pref-row">
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  Theme
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {theme === 'dark' ? 'Currently using dark mode' : 'Currently using light mode'}
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={toggleTheme}>
                {theme === 'dark' ? '☀ Light Mode' : '☾ Dark Mode'}
              </button>
            </div>
          </motion.div>

          {/* Account info */}
          <motion.div
            className="card settings-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="settings-panel-title">Account Info</div>

            <div className="settings-info-row">
              <span className="settings-info-label">Account ID</span>
              <span className="settings-info-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                {currentUser?._id}
              </span>
            </div>

            <div className="settings-info-row">
              <span className="settings-info-label">Account Type</span>
              <span className={`badge ${currentUser?.isDemo ? 'badge-warning' : 'badge-brand'}`}>
                {currentUser?.isDemo ? 'Demo Account' : 'Full Account'}
              </span>
            </div>

            <div className="settings-info-row">
              <span className="settings-info-label">Timezone</span>
              <span className="tz-chip">{currentUser?.timezone}</span>
            </div>

          </motion.div>

          {/* Danger zone */}
          <motion.div
            className="card settings-panel settings-danger-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <div className="settings-panel-title">Danger Zone</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Once you delete your account all your data will be permanently removed.
            </p>
            <button className="btn btn-danger w-full">
              Delete Account
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  )
}