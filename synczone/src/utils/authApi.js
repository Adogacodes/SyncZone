import api from './api'

export async function registerUser(data) {
  const res = await api.post('/auth/register', data)
  return res.data
}

export async function loginUser(data) {
  const res = await api.post('/auth/login', data)
  return res.data
}

export async function logoutUser() {
  const res = await api.post('/auth/logout')
  return res.data
}

export async function getMe() {
  const res = await api.get('/auth/me')
  return res.data
}

export async function updateProfile(data) {
  const res = await api.put('/auth/profile', data)
  return res.data
}