import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { MOCK_ACCOUNTS } from '../data/mockData'
import { getInitials, avatarStyle } from '../utils/helpers'

export default function Login() {
  const { login, loginWithEmail } = useApp()
  const [email, setEmail]         = useState('alex@synczone.io')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState('')

  function handleEmailLogin(e) {
    e.preventDefault()
    if (!email) { setError('Please enter an email'); return }
    loginWithEmail(email)
  }

  // Animation variants — define once, reference by name in JSX
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }
  }

  return (
    <div className="login-screen">

      {/* Animated background orbs */}
      <div className="login-orbs" aria-hidden="true">
        <div className="login-orb orb-1" />
        <div className="login-orb orb-2" />
        <div className="login-orb orb-3" />
      </div>

      {/* Grid overlay */}
      <div className="login-grid-bg" aria-hidden="true" />

      {/* Card */}
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >

        {/* Logo */}
        <motion.div
          className="login-logo-row"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="login-logo-icon">SZ</div>
          <div className="login-logo-name">
            Sync<span>Zone</span>
          </div>
        </motion.div>

        {/* Box */}
        <div className="login-box">

          <motion.div variants={container} initial="hidden" animate="show">

            <motion.div variants={item}>
              <p className="login-heading">Welcome back</p>
              <p className="login-subtext">
                Sign in to your workspace or pick a demo account below.
              </p>
            </motion.div>

            {/* Demo accounts */}
            <motion.div variants={item}>
              {MOCK_ACCOUNTS.map(account => (
                <button
                  key={account.id}
                  className="mock-user-card"
                  onClick={() => login(account)}
                >
                  <div
                    className="avatar avatar-md"
                    style={avatarStyle(account.colorIndex)}
                  >
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

            {/* Divider */}
            <motion.div variants={item}>
              <div className="divider-label">or continue with email</div>
            </motion.div>

            {/* Email form */}
            <motion.form variants={item} onSubmit={handleEmailLogin}>
              <div className="input-group">
                <label className="input-label">Email address</label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p style={{ color: 'var(--danger)', fontSize: '12px', marginBottom: '10px' }}>
                  {error}
                </p>
              )}

              <button type="submit" className="btn btn-primary w-full btn-lg">
                Continue →
              </button>
            </motion.form>

          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}