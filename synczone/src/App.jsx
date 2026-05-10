import { useApp } from './context/AppContext'
import Login from './pages/Login'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import Timeline from './pages/Timeline'
import Meeting from './pages/Meeting'
import MemberModal from './components/team/MemberModal'

export default function App() {
  const { isLoggedIn, activePage, setActivePage } = useApp()

  if (!isLoggedIn) return <Login />

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'dashboard' && <Dashboard />}
      {activePage === 'team'      && <Team />}
      {activePage === 'timeline'  && <Timeline />}
      {activePage === 'meeting'   && <Meeting />}
      <MemberModal />
    </AppLayout>
  )
}