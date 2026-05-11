import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { TIMEZONES } from '../data/mockData'
import { getInitials, avatarStyle } from '../utils/helpers'
import { AVATAR_COLORS } from '../data/mockData'

const DEMO_ACCOUNTS = [
  { name: 'Alex Kim',     role: 'Head of Engineering', email: 'alex@synczone.io',  password: 'password123', timezone: 'America/New_York',  colorIndex: 0 },
  { name: 'Priya Sharma', role: 'Product Manager',     email: 'priya@synczone.io', password: 'password123', timezone: 'Asia/Kolkata',       colorIndex: 1 },
  { name: 'Tom Eriksen',  role: 'CEO',                 email: 'tom@synczone.io',   password: 'password123', timezone: 'Europe/Stockholm',   colorIndex: 2 },
]

export default function Login() {
  const { login, register } = useApp()
  const [showPassword, setShowPassword] = useState(false)

  const [mode,     setMode]     = useState('login')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const [form, setForm] = useState({
    name:       '',
    email:      '',
    password:   '',
    timezone:   'UTC',
    colorIndex: 0,
  })

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

async function handleDemoLogin(account) {
  setLoading(true)
  setError('')
  try {
    await login(account.email, account.password)
  } catch {
    try {
      await register(
        account.name,
        account.email,
        account.password,
        account.timezone,
        account.colorIndex,
        true,
      )
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong')
    }
  } finally {
    setLoading(false)
  }
}

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password, form.timezone, form.colorIndex)
      }
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } }
  }

  const item = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }
  }

  return (
    <div className="login-screen">
      <div className="login-orbs" aria-hidden="true">
        <div className="login-orb orb-1" />
        <div className="login-orb orb-2" />
        <div className="login-orb orb-3" />
      </div>
      <div className="login-grid-bg" aria-hidden="true" />

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <motion.div
          className="login-logo-row"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="login-logo-icon">SZ</div>
          <div className="login-logo-name">Sync<span>Zone</span></div>
        </motion.div>

        <div className="login-box">
          <motion.div variants={container} initial="hidden" animate="show">

            <motion.div variants={item}>
              <p className="login-heading">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </p>
              <p className="login-subtext">
                {mode === 'login'
                  ? 'Sign in or pick a demo account below.'
                  : 'Join SyncZone and manage your remote team.'}
              </p>
            </motion.div>

            {/* Demo accounts — login mode only */}
            {mode === 'login' && (
              <motion.div variants={item}>
                {DEMO_ACCOUNTS.map((account, i) => (
                  <button
                    key={i}
                    className="mock-user-card"
                    onClick={() => handleDemoLogin(account)}
                    disabled={loading}
                  >
                    <div className="avatar avatar-md" style={avatarStyle(account.colorIndex)}>
                      {getInitials(account.name)}
                    </div>
                    <div className="mock-user-info">
                      <div className="mock-user-name">{account.name}</div>
                      <div className="mock-user-role">{account.role}</div>
                    </div>
                    <span className="mock-tz-pill">
                      {account.timezone.split('/').pop().replace(/_/g, ' ')}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}

            <motion.div variants={item}>
              <div className="divider-label">
                {mode === 'login' ? 'or sign in with email' : 'fill in your details'}
              </div>
            </motion.div>

            {/* Form */}
            <motion.form variants={item} onSubmit={handleSubmit}>

              {mode === 'register' && (
                <>
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input
                      className="input"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={e => setField('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Timezone</label>
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

                  <div className="input-group">
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
                </>
              )}

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setField('email', e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
  <label className="input-label">Password</label>
  <div className="password-input-wrap">
    <input
      className="input"
      type={showPassword ? 'text' : 'password'}
      placeholder="••••••••"
      value={form.password}
      onChange={e => setField('password', e.target.value)}
      required
      minLength={6}
    />
    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowPassword(prev => !prev)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? (
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

              {error && (
                <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '12px' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full btn-lg"
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'login' ? 'Sign In →' : 'Create Account →'
                }
              </button>

              <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '16px' }}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-sans)' }}
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>

            </motion.form>

          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}