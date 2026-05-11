import api from './api'

export async function fetchMembers() {
  const res = await api.get('/members')
  return res.data
}

export async function createMember(data) {
  const res = await api.post('/members', data)
  return res.data
}

export async function updateMember(id, data) {
  const res = await api.put(`/members/${id}`, data)
  return res.data
}

export async function deleteMember(id) {
  const res = await api.delete(`/members/${id}`)
  return res.data
}

export async function seedMembers() {
  const res = await api.post('/members/seed')
  return res.data
}