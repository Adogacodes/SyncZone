import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout({ activePage, onNavigate, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">

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
          <Outlet />
          {children}
        </main>
      </div>

    </div>
  )
}