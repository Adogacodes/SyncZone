import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useToast } from '../components/ui/Toast'
import {
  getInitials,
  avatarStyle,
  formatTime,
  getMemberStatus,
  getStatusLabel,
  getStatusBadgeClass,
} from '../utils/helpers'

export default function Team() {
  const { members, openAddModal, openEditModal, deleteMember } = useApp()
  const toast = useToast()

  function handleDelete(member) {
    if (!confirm(`Remove ${member.name} from the team?`)) return
    deleteMember(member.id)
    toast(`${member.name} removed`, 'error')
  }

  return (
    <div className="page-enter">

      <div className="dashboard-heading">
        <div>
          <h2 className="page-title">Team Members</h2>
          <p className="page-sub">{members.length} members across your workspace</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5"  y1="12" x2="19" y2="12" />
          </svg>
          Add Member
        </button>
      </div>

      <div className="team-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Timezone</th>
              <th>Local Time</th>
              <th>Status</th>
              <th>Working Hours</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, i) => (
              <motion.tr
                key={member.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                {/* Member */}
                <td>
                  <div className="flex items-center gap-2">
                    <div className="avatar avatar-md" style={avatarStyle(member.colorIndex)}>
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {member.role}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Timezone */}
                <td>
                  <span className="tz-chip">{member.timezone}</span>
                </td>

                {/* Local time */}
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                    {formatTime(member.timezone)}
                  </span>
                </td>

                {/* Status */}
                <td>
                  <span className={`badge ${getStatusBadgeClass(getMemberStatus(member))}`}>
                    <span className="badge-dot" />
                    {getStatusLabel(getMemberStatus(member))}
                  </span>
                </td>

                {/* Working hours */}
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {member.workStart} – {member.workEnd}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="flex gap-2">
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(member)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(member)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}