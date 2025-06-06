import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { boardService } from '../services/board'
import { loadBoard, updateBoard } from '../store/board.actions'

export function TaskDetails() {
  const { boardId, groupId, taskId } = useParams()
  const navigate = useNavigate()
  const board = useSelector((state) => state.boardModule.board)
  const group = board?.groups?.find((g) => g.id === groupId)
  const task = group?.tasks?.find((t) => t.id === taskId)

  // Add state for description
  const [description, setDescription] = useState(task?.description || '')
  const [isEditing, setIsEditing] = useState(false)

  if (!board || !group || !task) {
    return (
      <div className="modal-overlay">
        <div className="modal-content task-details-modal">Loading...</div>
      </div>
    )
  }

  const taskLabels =
    board.labels?.filter((label) => task.labelIds?.includes(label.id)) || []
  const members = task.members || []

  const handleClose = () => navigate(-1)
  const handleOverlayClick = (ev) => {
    // Only handle clicks directly on the overlay, not its children
    if (ev.target === ev.currentTarget) {
      navigate(`/board/${boardId}`)
    }
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
    setIsEditing(true)
  }

  const handleSaveDescription = async () => {
    try {
      const updatedTask = {
        ...task,
        description,
      }

      // Create activity for the change
      const activity = {
        id: 1,
        type: 'description',
        text: 'updated the description',
        createdAt: Date.now(),
        byMember: {
          id: 'current-user-id', // You'll need to get this from your user service
          name: 'Current User',
        },
      }

      await boardService.saveTask(boardId, groupId, updatedTask, activity)
      setIsEditing(false)
      loadBoard(boardId)
    } catch (err) {
      console.error('Failed to save description:', err)
      // You might want to show an error message to the user here
    }
  }

  const handleCancel = () => {
    setDescription(task.description || '')
    setIsEditing(false)
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
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Add a more detailed description..."
                rows={4}
              />
              {isEditing && (
                <div className="description-actions">
                  <button
                    className="save-description-btn"
                    onClick={handleSaveDescription}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-description-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              )}
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
