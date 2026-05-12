import { useApp } from '../../context/AppContext'
import { getInitials, avatarStyle } from '../../utils/helpers'

const NAV_ITEMS = [
  {
    section: 'Workspace',
    links: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        ),
      },
      {
        id: 'timeline',
        label: 'Timeline',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        ),
      },
      {
        id: 'meeting',
        label: 'Schedule Meeting',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6"  />
            <line x1="8"  y1="2" x2="8"  y2="6"  />
            <line x1="3"  y1="10" x2="21" y2="10" />
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Team',
    links: [
      {
        id: 'team',
        label: 'Team Members',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9"  cy="7" r="4" />
            <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" opacity=".5" />
            <path d="M21 21v-2a4 4 0 0 0-3-3.85"              opacity=".5" />
          </svg>
        ),
      },
    ],
  },
  {
  section: 'Account',
  links: [
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ],
},
]

export default function Sidebar({ activePage, onNavigate, onClose }) {
  const { currentUser, members, toggleTheme, logout, theme } = useApp()

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">SZ</div>
        <div>
          <div className="sidebar-logo-name">
            Sync<span>Zone</span>
          </div>
        </div>
        <span className="sidebar-logo-version">v1.0</span>

        {/* Close button — mobile only */}
        <button
          className="btn-icon sidebar-close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6"  y2="18" />
            <line x1="6"  y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="sidebar-glow-line" />

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(group => (
          <div key={group.section}>
            <div className="nav-section-label">{group.section}</div>
            {group.links.map(link => (
              <div
                key={link.id}
                className={`nav-item ${activePage === link.id ? 'active' : ''}`}
                onClick={() => { onNavigate(link.id); onClose() }}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.id === 'team' && (
                  <span className="nav-badge">{members.length}</span>
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="nav-section-label">Preferences</div>

        <div className="nav-item" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1"  x2="12" y2="3"  />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"   />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1"  y1="12" x2="3"  y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </div>

        <div className="nav-item" onClick={logout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </div>
      </nav>

      {/* Current user */}
      {currentUser && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div
              className="avatar avatar-sm"
              style={avatarStyle(currentUser.colorIndex)}
            >
              {getInitials(currentUser.name)}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{currentUser.name}</div>
              <div className="sidebar-user-role">{currentUser.role}</div>
            </div>
            <div className="nav-badge-dot" />
          </div>
        </div>
      )}
    </aside>
  )
}