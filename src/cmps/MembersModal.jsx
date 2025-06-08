export function MembersModal({
  boardMembers,
  cardMemberIds,
  onClose,
  onToggleMember,
}) {
  return (
    <div className="members-modal-overlay" onClick={onClose}>
      <div className="members-modal" onClick={(e) => e.stopPropagation()}>
        <div className="members-modal-header">
          <span>Members</span>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="members-list">
          {boardMembers.map((member) => {
            const initials = member.fullname
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
            const isChecked = cardMemberIds.includes(member._id)
            return (
              <label key={member._id} className="member-row">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleMember(member._id)}
                />
                <span className="task-member-avatar" title={member.fullname}>
                  {initials}
                </span>
                <span className="member-name">{member.fullname}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
