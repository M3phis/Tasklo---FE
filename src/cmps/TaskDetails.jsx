import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function TaskDetails() {
  const { boardId, groupId, taskId } = useParams()
  const navigate = useNavigate()
  const board = useSelector((state) => state.boardModule.board)
  const group = board?.groups?.find((g) => g.id === groupId)
  const task = group?.tasks?.find((t) => t.id === taskId)

  if (!board || !group || !task) {
    return (
      <div className="modal-overlay">
        <div className="modal-content task-details-modal">Loading...</div>
      </div>
    )
  }

  const description = task.description || ''
  const taskLabels =
    board.labels?.filter((label) => task.labelIds?.includes(label.id)) || []
  const members = task.members || []

  const handleClose = () => navigate(-1)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) navigate(-1)
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content task-details-modal">
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        <div className="task-details-layout">
          <div className="task-details-main">
            <div className="task-details-title-row">
              <input className="task-title-input" value={task.title} readOnly />
              <span className="task-group-name">
                in list <b>{group.title}</b>
              </span>
            </div>

            <div className="task-details-actions-row">
              <button>+ Add</button>
              <button>Labels</button>
              <button>Dates</button>
              <button>Checklist</button>
              <button>Attachment</button>
            </div>
            <div className="task-details-info">
              <div className="task-details-members-row">
                <span>Members</span>
                <div className="task-members-list">
                  {members.map((member) => (
                    <span
                      key={member.id}
                      className="task-member-avatar"
                      title={member.name}
                    >
                      {member.name[0]}
                    </span>
                  ))}
                  <button className="add-member-btn">+</button>
                </div>
              </div>

              <div className="task-details-labels-row">
                <span>Labels</span>
                <div className="task-labels-list">
                  {taskLabels.map((label) => (
                    <span
                      key={label.id}
                      className="task-label"
                      style={{ background: label.color }}
                      title={label.title}
                    ></span>
                  ))}
                  <button className="add-label-btn">+</button>
                </div>
              </div>
            </div>

            <div className="task-details-section">
              <span className="section-title">Description</span>
              <textarea
                className="task-description-input"
                defaultValue={description}
                placeholder="Add a more detailed description..."
                rows={4}
              />
              <button className="save-description-btn">Save</button>
            </div>
          </div>

          {/* Right/Sidebar */}
          <div className="task-details-sidebar">
            <div className="task-details-activity">
              <div className="activity-header">
                <span>Comments and activity</span>
                <button className="show-details-btn">Show details</button>
              </div>
              <input
                className="comment-input"
                placeholder="Write a comment..."
              />
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-avatar">TA</span>
                  <div className="activity-content">
                    <b>Tomer Almog</b> added this card to{' '}
                    <b>Questions For Next Meeting</b>
                    <div className="activity-date">May 26, 2025, 7:21 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
