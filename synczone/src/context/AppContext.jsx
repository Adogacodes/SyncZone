import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { DEFAULT_MEMBERS, MOCK_ACCOUNTS } from '../data/mockData'
import { getTodayString } from '../utils/helpers'

// ── CONSTANTS ─────────────────────────────────────────────

const STORAGE_KEY_MEMBERS = 'synczone_members'
const STORAGE_KEY_THEME   = 'synczone_theme'

// ── REDUCER ───────────────────────────────────────────────

// All member-related state changes flow through here.
// A reducer is just a function: (currentState, action) => newState
// Using a reducer instead of multiple useState calls keeps
// related logic in one place and makes changes predictable.

function membersReducer(state, action) {

  
  switch (action.type) {

    case 'LOAD':
      return action.payload

    case 'ADD':
      return [
        ...state,
        { ...action.payload, id: Date.now() },
      ]

    case 'UPDATE':
      return state.map(m =>
        m.id === action.payload.id ? { ...m, ...action.payload } : m
      )

    case 'DELETE':
      return state.filter(m => m.id !== action.payload)

    default:
      return state
  }
}

// ── CONTEXT ───────────────────────────────────────────────

const AppContext = createContext(null)

// ── PROVIDER ──────────────────────────────────────────────

export function AppProvider({ children }) {

  // ── Auth state
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggedIn,  setIsLoggedIn]  = useState(false)

  // ── Theme state
  const [theme, setTheme] = useState('dark')

  // Add this with the other state declarations (around line 20)
const [activePage, setActivePage] = useState('dashboard')

  // ── Members state — managed by reducer
  const [members, dispatch] = useReducer(membersReducer, [])

  // ── Meeting scheduler state
  const [meetingDate, setMeetingDate] = useState(getTodayString())
  const [meetingTime, setMeetingTime] = useState('14:00')
  const [meetingName, setMeetingName] = useState('Team Standup')

  // ── Modal state
  const [memberModal, setMemberModal] = useState({ open: false, member: null })


  // ── EFFECTS ───────────────────────────────────────────────

  // On mount: load persisted members and theme from localStorage
  useEffect(() => {
    const savedMembers = localStorage.getItem(STORAGE_KEY_MEMBERS)
    const savedTheme   = localStorage.getItem(STORAGE_KEY_THEME)

    dispatch({
      type: 'LOAD',
      payload: savedMembers ? JSON.parse(savedMembers) : DEFAULT_MEMBERS,
    })

    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('theme-light', savedTheme === 'light')
    }
  }, [])

  // Whenever members change, persist them
  useEffect(() => {
    if (members.length > 0) {
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members))
    }
  }, [members])


  // ── AUTH ACTIONS ──────────────────────────────────────────

  function login(user) {
    setCurrentUser(user)
    setIsLoggedIn(true)
  }

  function loginWithEmail(email) {
    const found = MOCK_ACCOUNTS.find(u => u.email === email)
    login(found ?? MOCK_ACCOUNTS[0])
  }

  function logout() {
    setCurrentUser(null)
    setIsLoggedIn(false)
  }


  // ── THEME ACTIONS ─────────────────────────────────────────

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('theme-light', next === 'light')
    localStorage.setItem(STORAGE_KEY_THEME, next)
  }


  // ── MEMBER ACTIONS ────────────────────────────────────────

  function addMember(data) {
    dispatch({ type: 'ADD', payload: data })
  }

  function updateMember(data) {
    dispatch({ type: 'UPDATE', payload: data })
  }

  function deleteMember(id) {
    dispatch({ type: 'DELETE', payload: id })
  }


  // ── MODAL HELPERS ─────────────────────────────────────────

  function openAddModal() {
    setMemberModal({ open: true, member: null })
  }

  function openEditModal(member) {
    setMemberModal({ open: true, member })
  }

  function closeModal() {
    setMemberModal({ open: false, member: null })
  }


  // ── CONTEXT VALUE ─────────────────────────────────────────
  // Everything we expose to the rest of the app

  const value = {
    // auth
    currentUser,
    isLoggedIn,
    login,
    loginWithEmail,
    logout,

    // theme
    theme,
    toggleTheme,

    // members
    members,
    addMember,
    updateMember,
    deleteMember,

    // meeting
    meetingDate, setMeetingDate,
    meetingTime, setMeetingTime,
    meetingName, setMeetingName,

    // modal
    memberModal,
    openAddModal,
    openEditModal,
    closeModal,

    // Inside the value = { ... } object
activePage,
setActivePage,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// ── HOOK ──────────────────────────────────────────────────

// Custom hook so any component can do:
// const { members, addMember } = useApp()
// instead of importing both useContext and AppContext everywhere

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}