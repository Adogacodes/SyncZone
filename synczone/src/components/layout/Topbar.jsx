import { useApp } from '../../context/AppContext'

const PAGE_META = {
  dashboard: { title: 'Dashboard',        sub: 'Live overview of your remote team'     },
  timeline:  { title: 'Timeline',         sub: '24-hour overlap grid'                  },
  meeting:   { title: 'Schedule Meeting', sub: 'Find the best time for everyone'        },
  team:      { title: 'Team Members',     sub: 'Manage your remote team'               },
}

export default function Topbar({ activePage, onNavigate, onMobileMenuOpen }) {
  const { openAddModal } = useApp()
  const meta = PAGE_META[activePage] ?? PAGE_META.dashboard

  return (
    <>
      {/* Desktop topbar */}
      <header className="topbar">
        <div className="topbar-breadcrumb">
          <div>
            <div className="topbar-page-name">{meta.title}</div>
            <div className="topbar-page-sub">{meta.sub}</div>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={openAddModal}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5"  y1="12" x2="19" y2="12" />
            </svg>
            Add Member
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate('meeting')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2"  x2="16" y2="6"  />
              <line x1="8"  y1="2"  x2="8"  y2="6"  />
              <line x1="3"  y1="10" x2="21" y2="10" />
            </svg>
            Schedule
          </button>
        </div>
      </header>

      {/* Mobile topbar */}
      <header className="mobile-bar">
        <button
          className="btn-icon"
          onClick={onMobileMenuOpen}
          aria-label="Open menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <div className="sidebar-logo-icon" style={{ width: '26px', height: '26px', fontSize: '11px', borderRadius: '7px' }}>
            SZ
          </div>
          <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.3px' }}>
            SyncZone
          </span>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => onNavigate('meeting')}
        >
          Schedule
        </button>
      </header>
    </>
  )
}