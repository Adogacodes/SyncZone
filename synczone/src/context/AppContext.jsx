import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import {
  loginUser,
  logoutUser,
  registerUser,
  getMe,
} from '../utils/authApi'
import {
  fetchMembers,
  createMember,
  updateMember,
  deleteMember,
  seedMembers,
} from '../utils/membersApi'
import { getTodayString } from '../utils/helpers'

const STORAGE_KEY_THEME = 'synczone_theme'

function membersReducer(state, action) {
  switch (action.type) {
    case 'LOAD':   return action.payload
    case 'ADD':    return [...state, action.payload]
    case 'UPDATE': return state.map(m => m._id === action.payload._id ? action.payload : m)
    case 'DELETE': return state.filter(m => m._id !== action.payload)
    default:       return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {

  const [currentUser,    setCurrentUser]    = useState(null)
  const [isLoggedIn,     setIsLoggedIn]     = useState(false)
  const [authLoading,    setAuthLoading]    = useState(true)
  const [theme,          setTheme]          = useState('dark')
  const [activePage,     setActivePage]     = useState('dashboard')
  const [members,        dispatch]          = useReducer(membersReducer, [])
  const [membersLoading, setMembersLoading] = useState(false)
  const [meetingDate,    setMeetingDate]    = useState(getTodayString())
  const [meetingTime,    setMeetingTime]    = useState('14:00')
  const [meetingName,    setMeetingName]    = useState('Team Standup')
  const [memberModal,    setMemberModal]    = useState({ open: false, member: null })


  // ── THEME ───────────────────────────────────────────────

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME)
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.toggle('theme-light', saved === 'light')
    }
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('theme-light', next === 'light')
    localStorage.setItem(STORAGE_KEY_THEME, next)
  }


  // ── LOAD MEMBERS HELPER ──────────────────────────────────

  async function loadMembers() {
    setMembersLoading(true)
    try {
      const data = await fetchMembers()
      dispatch({ type: 'LOAD', payload: data })
    } catch (err) {
      console.error('Failed to load members:', err)
    } finally {
      setMembersLoading(false)
    }
  }


  // ── SESSION CHECK ON MOUNT ───────────────────────────────

  useEffect(() => {
  let cancelled = false

  async function checkSession() {
    const token = localStorage.getItem('synczone_token')
    if (!token) {
      setAuthLoading(false)
      return
    }
    try {
      const user = await getMe()
      if (cancelled) return
      setCurrentUser(user)
      setIsLoggedIn(true)
      const data = await fetchMembers()
      if (cancelled) return
      dispatch({ type: 'LOAD', payload: data })
    } catch {
      if (cancelled) return
      localStorage.removeItem('synczone_token')
      setCurrentUser(null)
      setIsLoggedIn(false)
    } finally {
      if (!cancelled) setAuthLoading(false)
    }
  }

  checkSession()
  return () => { cancelled = true }
}, [])


  // ── AUTH ────────────────────────────────────────────────

async function login(email, password) {
  const user = await loginUser({ email, password })
  if (user.token) localStorage.setItem('synczone_token', user.token)
  setCurrentUser(user)
  setIsLoggedIn(true)

  const data = await fetchMembers()
  if (data.length === 0 && user.isDemo) {
    try {
      await seedMembers()
      const seeded = await fetchMembers()
      dispatch({ type: 'LOAD', payload: seeded })
    } catch {
      dispatch({ type: 'LOAD', payload: data })
    }
  } else {
    dispatch({ type: 'LOAD', payload: data })
  }
}

  async function register(name, email, password, timezone, colorIndex, isDemo = false) {
  const user = await registerUser({ name, email, password, timezone, colorIndex, isDemo })
  if (user.token) localStorage.setItem('synczone_token', user.token)
  setCurrentUser(user)
  setIsLoggedIn(true)

  if (isDemo) {
    try {
      await seedMembers()
    } catch {
      // already seeded
    }
  }

  const data = await fetchMembers()
  dispatch({ type: 'LOAD', payload: data })
}

  async function logout() {
  try { await logoutUser() } catch { /* ignore */ }
  localStorage.removeItem('synczone_token')
  setCurrentUser(null)
  setIsLoggedIn(false)
  dispatch({ type: 'LOAD', payload: [] })
  setActivePage('dashboard')
  setAuthLoading(false)
}


  // ── MEMBERS ─────────────────────────────────────────────

  async function addMember(data) {
    const member = await createMember(data)
    dispatch({ type: 'ADD', payload: member })
  }

  async function editMember(data) {
    const updated = await updateMember(data._id, data)
    dispatch({ type: 'UPDATE', payload: updated })
  }

  async function removeMember(id) {
    await deleteMember(id)
    dispatch({ type: 'DELETE', payload: id })
  }


  // ── MODAL ───────────────────────────────────────────────

  function openAddModal()        { setMemberModal({ open: true, member: null })  }
  function openEditModal(member) { setMemberModal({ open: true, member })        }
  function closeModal()          { setMemberModal({ open: false, member: null }) }


  // ── VALUE ───────────────────────────────────────────────

  const value = {
    currentUser,
    isLoggedIn,
    authLoading,
    login,
    register,
    logout,

    theme,
    toggleTheme,

    activePage,
    setActivePage,

    members,
    membersLoading,
    addMember,
    updateMember: editMember,
    deleteMember: removeMember,

    meetingDate, setMeetingDate,
    meetingTime, setMeetingTime,
    meetingName, setMeetingName,

    memberModal,
    openAddModal,
    openEditModal,
    closeModal,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}