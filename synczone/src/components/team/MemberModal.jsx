import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useToast } from '../ui/Toast'
import { TIMEZONES, AVATAR_COLORS } from '../../data/mockData'
import { getInitials, avatarStyle } from '../../utils/helpers'
import Modal from '../ui/Modal'

const EMPTY_FORM = {
  name:       '',
  role:       '',
  timezone:   'America/New_York',
  workStart:  '09:00',
  workEnd:    '17:00',
  colorIndex: 0,
}

export default function MemberModal() {
  const { memberModal, closeModal, addMember, updateMember } = useApp()
  const toast = useToast()

  const isEditing = !!memberModal.member
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  // Populate form when editing
  useEffect(() => {
    if (memberModal.open) {
      setForm(memberModal.member
        ? { ...memberModal.member }
        : { ...EMPTY_FORM }
      )
      setErrors({})
    }
  }, [memberModal])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())     e.name     = 'Name is required'
    if (!form.role.trim())     e.role     = 'Role is required'
    if (!form.timezone)        e.timezone = 'Timezone is required'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    if (isEditing) {
      updateMember(form)
      toast('Member updated successfully')
    } else {
      addMember(form)
      toast('Member added to team')
    }
    closeModal()
  }

  const preview = avatarStyle(form.colorIndex)

  return (
    <Modal
      open={memberModal.open}
      onClose={closeModal}
      title={isEditing ? 'Edit Team Member' : 'Add Team Member'}
      footer={
        <>
          <button className="btn btn-ghost" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {isEditing ? 'Save Changes' : 'Add Member'}
          </button>
        </>
      }
    >
      {/* Avatar preview */}
      <div className="member-modal-preview">
        <div className="avatar avatar-xl" style={preview}>
          {form.name ? getInitials(form.name) : '?'}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
            {form.name || 'New Member'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {form.role || 'Role'}
          </div>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
            {form.timezone}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Name */}
      <div className="input-group">
        <label className="input-label">Full Name</label>
        <input
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="e.g. Sarah Johnson"
          value={form.name}
          onChange={e => set('name', e.target.value)}
        />
        {errors.name && <span className="input-error-msg">{errors.name}</span>}
      </div>

      {/* Role */}
      <div className="input-group">
        <label className="input-label">Role / Title</label>
        <input
          className={`input ${errors.role ? 'input-error' : ''}`}
          placeholder="e.g. Senior Engineer"
          value={form.role}
          onChange={e => set('role', e.target.value)}
        />
        {errors.role && <span className="input-error-msg">{errors.role}</span>}
      </div>

      {/* Timezone */}
      <div className="input-group">
        <label className="input-label">Timezone</label>
        <select
          className={`select ${errors.timezone ? 'input-error' : ''}`}
          value={form.timezone}
          onChange={e => set('timezone', e.target.value)}
        >
          {TIMEZONES.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
        {errors.timezone && <span className="input-error-msg">{errors.timezone}</span>}
      </div>

      {/* Working hours */}
      <div className="input-group">
        <label className="input-label">Working Hours</label>
        <div className="working-hours-row">
          <input
            type="time"
            className="input"
            value={form.workStart}
            onChange={e => set('workStart', e.target.value)}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '12px', flexShrink: 0 }}>to</span>
          <input
            type="time"
            className="input"
            value={form.workEnd}
            onChange={e => set('workEnd', e.target.value)}
          />
        </div>
      </div>

      {/* Color picker */}
      <div className="input-group" style={{ marginBottom: 0 }}>
        <label className="input-label">Avatar Color</label>
        <div className="color-picker">
          {AVATAR_COLORS.map((c, i) => (
            <button
              key={i}
              className={`color-swatch ${form.colorIndex === i ? 'active' : ''}`}
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
              onClick={() => set('colorIndex', i)}
              aria-label={`Color option ${i + 1}`}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: c.text }} />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}