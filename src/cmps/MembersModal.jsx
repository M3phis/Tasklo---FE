export function MembersModal({
  boardMembers,
  cardMemberIds,
  position,
  onClose,
  onToggleMember,
}) {
  const getInitials = (fullname) => {
    if (!fullname) return 'U'
    return fullname
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const cardMembers = boardMembers.filter((member) =>
    cardMemberIds?.includes(member._id)
  )

  const availableMembers = boardMembers.filter(
    (member) => !cardMemberIds?.includes(member._id)
  )

  const handleMemberClick = (memberId) => {
    onToggleMember(memberId)
  }

  return (
    <div className="members-modal-overlay" onClick={onClose}>
      <div
        className="members-modal"
        onClick={(e) => e.stopPropagation()}
        style={
          position
            ? {
                position: 'absolute',
                top: position.y,
                left: position.x,
                transform: position.alignAbove ? 'translateY(-100%)' : 'none',
              }
            : {}
        }
      >
        <div className="members-modal-header">
          <span>Members</span>
          <button className="members-modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="members-search">
          <input
            type="text"
            placeholder="Search members"
            className="members-search-input"
          />
        </div>

        {/* Card Members Section */}
        <div className="members-section">
          <h4 className="members-section-title">Card members</h4>
          <div className="members-list">
            {cardMembers.map((member) => (
              <div
                key={member._id}
                className="member-row"
                onClick={() => handleMemberClick(member._id)}
              >
                <div className="member-avatar">
                  {getInitials(member.fullname)}
                </div>
                <span className="member-name">{member.fullname}</span>
                <button className="member-remove-btn">×</button>
              </div>
            ))}
            {cardMembers.length === 0 && (
              <div className="no-members">No members assigned</div>
            )}
          </div>
        </div>

        {/* Board Members Section */}
        <div className="members-section">
          <h4 className="members-section-title">Board members</h4>
          <div className="members-list">
            {availableMembers.map((member) => (
              <div
                key={member._id}
                className="member-row"
                onClick={() => handleMemberClick(member._id)}
              >
                <div className="member-avatar">
                  {getInitials(member.fullname)}
                </div>
                <span className="member-name">{member.fullname}</span>
              </div>
            ))}
            {availableMembers.length === 0 && (
              <div className="no-members">All board members are assigned</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
