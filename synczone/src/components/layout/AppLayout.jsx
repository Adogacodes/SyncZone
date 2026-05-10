import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout({ children, activePage, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'overlay-show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-content">
        <Topbar
          activePage={activePage}
          onNavigate={onNavigate}
          onMobileMenuOpen={() => setSidebarOpen(true)}
        />
        <main className="page-content">
          {children}
        </main>
      </div>

    </div>
  )
}