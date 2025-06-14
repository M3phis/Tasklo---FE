import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { boardService } from '../services/board'
import { loadBoard, updateBoard } from '../store/board.actions'
import { LabelsModal } from './LabelsModal'
import { MembersModal } from './MembersModal'
import { DatesModal } from './DatesModal'
import { Checklist } from './Checklist'
import { AttachmentsModal } from './AttachmentsModal'
import { AddChecklistModal } from './AddChecklistModal'

export function TaskDetails({}) {
  const { boardId, groupId, taskId } = useParams()
  const navigate = useNavigate()
  const board = useSelector((state) => state.boardModule.board)
  const group = board?.groups?.find((g) => g.id === groupId)
  const task = group?.tasks?.find((t) => t.id === taskId)

  const [description, setDescription] = useState(task?.description || '')
  const [isEditing, setIsEditing] = useState(false)
  const [showLabelsModal, setShowLabelsModal] = useState(false)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [showDatesModal, setShowDatesModal] = useState(false)
  const [taskLabelIds, setTaskLabelIds] = useState(task?.labelIds || [])
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false)
  const [attachmentButtonPosition, setAttachmentButtonPosition] = useState({
    x: 0,
    y: 0,
  })
  const [showAddChecklistModal, setShowAddChecklistModal] = useState(false)
  const [checklistButtonPosition, setChecklistButtonPosition] = useState({
    x: 0,
    y: 0,
  })
  const [activeButton, setActiveButton] = useState(null)

  const { handleUpdateTask } = useOutletContext()
  useEffect(() => {
    setTaskLabelIds(task?.labelIds || [])
  }, [task])

  if (!board || !group || !task) {
    return (
      <div className="modal-overlay">
        <div className="modal-content task-details-modal">Loading...</div>
      </div>
    )
  }

  const handleToggleMember = (memberId) => {
    let updatedMemberIds
    if (task.memberIds.includes(memberId)) {
      updatedMemberIds = task.memberIds.filter((id) => id !== memberId)
    } else {
      updatedMemberIds = [...task.memberIds, memberId]
    }
    const updatedTask = { ...task, memberIds: updatedMemberIds }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
  }

  const handleUpdateDates = (dateUpdates) => {
    const updatedTask = { ...task, ...dateUpdates }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
  }

  const handleUpdateChecklist = (updatedChecklist) => {
    const updatedChecklists = task.checklists.map((checklist) =>
      checklist.id === updatedChecklist.id ? updatedChecklist : checklist
    )
    const updatedTask = { ...task, checklists: updatedChecklists }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
  }

  const handleDeleteChecklist = (checklistId) => {
    const updatedChecklists = task.checklists.filter(
      (checklist) => checklist.id !== checklistId
    )
    const updatedTask = { ...task, checklists: updatedChecklists }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
  }

  const handleAddChecklist = (newChecklist) => {
    const updatedChecklists = [...(task.checklists || []), newChecklist]
    const updatedTask = { ...task, checklists: updatedChecklists }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
  }

  const taskLabels =
    board.labels?.filter((label) => task.labelIds?.includes(label.id)) || []
  const members = task.memberIds || []
  const hasLabels = taskLabels.length > 0
  const hasDueDate = task.dueDate

  // Format due date for display
  const formatDueDate = (epochTime) => {
    if (!epochTime) return ''
    const date = new Date(epochTime)
    const currentYear = new Date().getFullYear()
    const dateYear = date.getFullYear()

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const month = months[date.getMonth()]
    const day = date.getDate()
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // 0 should be 12

    // Include year if different from current year
    const yearStr = dateYear !== currentYear ? `, ${dateYear}` : ''
    return `${month} ${day}${yearStr}, ${hours}:${minutes} ${ampm}`
  }

  // Check if due date is overdue
  const isOverdue = (epochTime) => {
    if (!epochTime) return false
    const now = new Date().getTime()
    return epochTime < now
  }

  const handleClose = () => navigate(-1)
  const handleOverlayClick = (ev) => {
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

  const handleToggleLabel = (labelId) => {
    // Prepare updated labelIds
    let updatedLabelIds
    if (taskLabelIds.includes(labelId)) {
      updatedLabelIds = taskLabelIds.filter((id) => id !== labelId)
    } else {
      updatedLabelIds = [...taskLabelIds, labelId]
    }
    setTaskLabelIds(updatedLabelIds)

    // Prepare updated task and group
    const updatedTask = { ...task, labelIds: updatedLabelIds }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }

    // Call the update function (which updates the board and Redux)
    handleUpdateTask(updatedGroup)
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content task-details-modal">
        {/* HEADER */}
        <div className="task-details-header">
          <div className="task-details-header-left">
            <div className="task-list-title-badge">{group.title}</div>
          </div>
          <div className="task-details-header-right"></div>
        </div>

        <div className="task-details-layout">
          <div className="task-details-main">
            <div className="task-details-title-row">
              <input
                type="checkbox"
                className="task-done-checkbox"
                // checked={task.status === 'done'}
                // onChange={handleDoneToggle}
              />
              <input className="task-title-input" value={task.title} readOnly />
            </div>

            <div className="task-details-actions-row">
              <button>+ Add</button>
              {!hasLabels && (
                <button
                  className={`labels-btn ${
                    activeButton === 'labels' ? 'active' : ''
                  }`}
                  onClick={() => {
                    setActiveButton('labels')
                    setShowLabelsModal(true)
                  }}
                >
                  Labels
                </button>
              )}
              {!hasDueDate && (
                <button
                  className={activeButton === 'dates' ? 'active' : ''}
                  onClick={() => {
                    setActiveButton('dates')
                    setShowDatesModal(true)
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 16 16"
                      style={{ marginRight: 4 }}
                    >
                      <path
                        d="M8 2v6l4.2 2.5"
                        stroke={activeButton === 'dates' ? 'white' : '#44546F'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="8"
                        cy="8"
                        r="6.25"
                        stroke={activeButton === 'dates' ? 'white' : '#44546F'}
                        strokeWidth="1.5"
                      />
                    </svg>
                    Dates
                  </span>
                </button>
              )}
              <button
                className={activeButton === 'checklist' ? 'active' : ''}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setChecklistButtonPosition({
                    x: rect.left,
                    y: rect.bottom + 8,
                  })
                  setActiveButton('checklist')
                  setShowAddChecklistModal(true)
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 16 16"
                    style={{ marginRight: 4 }}
                  >
                    <rect
                      x="2"
                      y="4"
                      width="12"
                      height="10"
                      rx="2"
                      stroke={
                        activeButton === 'checklist' ? 'white' : '#44546F'
                      }
                      strokeWidth="1.5"
                    />
                    <path
                      d="M5 2v2M11 2v2"
                      stroke={
                        activeButton === 'checklist' ? 'white' : '#44546F'
                      }
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5.5 8.5l2 2 3-3"
                      stroke={
                        activeButton === 'checklist' ? 'white' : '#44546F'
                      }
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Checklist
                </span>
              </button>
              <button
                className={activeButton === 'attachment' ? 'active' : ''}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setAttachmentButtonPosition({
                    x: rect.left,
                    y: rect.bottom + 8, // 8px gap below the button
                  })
                  setActiveButton('attachment')
                  setShowAttachmentsModal(true)
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 -960 960 960"
                    width="20"
                    fill={activeButton === 'attachment' ? 'white' : '#5f6368'}
                    style={{ marginRight: 4, transform: 'rotate(50deg)' }}
                  >
                    <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
                  </svg>
                  Attachment
                </span>
              </button>
            </div>

            <div className="task-details-info">
              <div className="task-details-members-section">
                <span className="section-header">Members</span>
                <div className="task-members-list">
                  {members.map((memberId) => {
                    const member = board.members.find((m) => m._id === memberId)
                    const initials = member?.fullname
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                    return (
                      <span
                        key={memberId}
                        className="task-member-avatar"
                        title={member?.fullname}
                      >
                        {initials}
                      </span>
                    )
                  })}
                  <button
                    className="add-member-btn"
                    onClick={() => setShowMembersModal(true)}
                  >
                    +
                  </button>
                </div>
              </div>

              {hasLabels && (
                <div className="task-details-labels-section">
                  <span className="section-header">Labels</span>
                  <div className="task-labels-list">
                    {taskLabels.map((label) => (
                      <span
                        key={label.id}
                        className="task-label"
                        style={{ background: label.color }}
                        title={label.title}
                      ></span>
                    ))}
                    <button
                      className="add-label-btn"
                      onClick={() => setShowLabelsModal(true)}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {hasDueDate && (
                <div className="task-details-due-date-section">
                  <span className="section-header">Due date</span>
                  <div className="due-date-display">
                    <span
                      className="due-date-text"
                      onClick={() => setShowDatesModal(true)}
                    >
                      {formatDueDate(task.dueDate)}
                      {isOverdue(task.dueDate) && (
                        <span className="overdue-badge">Overdue</span>
                      )}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="dropdown-arrow"
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="#5e6c84"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="task-details-description">
              <h3>Description</h3>
              {isEditing ? (
                <div className="description-edit">
                  <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Add a more detailed description..."
                  />
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
                </div>
              ) : (
                <div
                  className="description-view"
                  onClick={() => setIsEditing(true)}
                >
                  {description || 'Add a more detailed description...'}
                </div>
              )}
            </div>

            {/* Checklists */}
            {task.checklists && task.checklists.length > 0 && (
              <div className="task-details-checklists">
                {task.checklists.map((checklist) => (
                  <Checklist
                    key={checklist.id}
                    checklist={checklist}
                    onUpdateChecklist={handleUpdateChecklist}
                    onDeleteChecklist={handleDeleteChecklist}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right/Sidebar */}
          <div className="task-details-sidebar">
            <div className="task-details-activity">
              <div className="activity-header">
                <span className="activity-header-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18"
                    viewBox="0 -960 960 960"
                    width="18"
                    fill="#5f6368"
                    style={{ marginRight: 6, verticalAlign: 'middle' }}
                  >
                    <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
                  </svg>
                  Comments and activity
                </span>
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

      {showLabelsModal && (
        <LabelsModal
          labels={board.labels}
          taskLabelIds={taskLabelIds}
          onClose={() => {
            setShowLabelsModal(false)
            setActiveButton(null)
          }}
          onToggleLabel={handleToggleLabel}
        />
      )}

      {showMembersModal && (
        <MembersModal
          boardMembers={board.members}
          cardMemberIds={task.memberIds}
          onClose={() => {
            setShowMembersModal(false)
            setActiveButton(null)
          }}
          onToggleMember={handleToggleMember}
        />
      )}

      {showDatesModal && (
        <DatesModal
          task={task}
          onClose={() => {
            setShowDatesModal(false)
            setActiveButton(null)
          }}
          onUpdateDates={handleUpdateDates}
        />
      )}

      {showAttachmentsModal && (
        <AttachmentsModal
          task={task}
          position={attachmentButtonPosition}
          onClose={() => {
            setShowAttachmentsModal(false)
            setActiveButton(null)
          }}
        />
      )}

      {showAddChecklistModal && (
        <AddChecklistModal
          position={checklistButtonPosition}
          onClose={() => {
            setShowAddChecklistModal(false)
            setActiveButton(null)
          }}
          onAddChecklist={handleAddChecklist}
        />
      )}
    </div>
  )
}
