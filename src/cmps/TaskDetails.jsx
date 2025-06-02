import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function TaskDetails() {
  const { boardId, groupId, taskId } = useParams()
  const navigate = useNavigate()
  const board = useSelector((state) => state.boardModule.board)
  const group = board?.groups?.find((g) => g.id === groupId)
  const task = group?.tasks?.find((t) => t.id === taskId)

  // Show loading if data is not ready
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

  // Hardcoded for now
  const members = [
    { id: 'm1', name: 'John Doe' },
    { id: 'm2', name: 'Jane Smith' },
  ]

  const handleClose = () => navigate(-1)

  const handleOverlayClick = (e) => {
    // Only close if the user clicked directly on the overlay, not inside the modal
    if (e.target === e.currentTarget) {
      navigate(-1)
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content task-details-modal">
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        <h2>{task.title}</h2>
        <div className="task-details-header">
          <button>+ Add</button>
          <button>Dates</button>
          <button>Checklist</button>
          <button>Members</button>
          <button>Attachment</button>
        </div>
        <div className="task-details-labels">
          <span>Labels:</span>
          {taskLabels.map((label) => (
            <span
              key={label.id}
              className="task-label"
              style={{ background: label.color }}
              title={label.title}
            ></span>
          ))}
          <button>+</button>
        </div>
        <form className="task-details-description">
          <label>Description</label>
          <textarea
            defaultValue={description}
            placeholder="Add a more detailed description..."
            rows={4}
          />
          <button type="submit">Save</button>
        </form>
        <div className="task-details-members">
          <span>Members:</span>
          {members.map((member) => (
            <span key={member.id} className="task-member">
              {member.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
