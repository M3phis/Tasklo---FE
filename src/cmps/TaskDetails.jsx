import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { boardService } from '../services/board'
import { updateBoard } from '../store/board.actions'
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
  const [labelButtonPosition, setLabelButtonPosition] = useState(null)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [showDatesModal, setShowDatesModal] = useState(false)
  const [datesButtonPosition, setDatesButtonPosition] = useState(null)
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
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(null)
  const [editingAttachment, setEditingAttachment] = useState(null)
  const [showFileMenu, setShowFileMenu] = useState(null)
  const [editingFile, setEditingFile] = useState(null)
  const [editingFileName, setEditingFileName] = useState('')

  const { handleUpdateTask } = useOutletContext()
  const dispatch = useDispatch()

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
    const currentMemberIds = task.memberIds || []
    let updatedMemberIds
    if (currentMemberIds.includes(memberId)) {
      updatedMemberIds = currentMemberIds.filter((id) => id !== memberId)
    } else {
      updatedMemberIds = [...currentMemberIds, memberId]
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
    const updatedChecklists = (task.checklists || []).map((checklist) =>
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
    const updatedChecklists = (task.checklists || []).filter(
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

    // Update local state
    setTaskLabelIds(updatedLabelIds)

    // Update task in the board
    const updatedTask = { ...task, labelIds: updatedLabelIds }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
  }

  const handleSaveLabel = async (updatedLabel) => {
    try {
      // Update the label in the board's labels array
      const updatedLabels = board.labels.map((label) =>
        label.id === updatedLabel.id ? updatedLabel : label
      )

      // Update the board with new labels
      const updatedBoard = { ...board, labels: updatedLabels }

      // Save to backend and update Redux
      await updateBoard(updatedBoard)

      console.log('Label updated successfully')
    } catch (err) {
      console.error('Failed to save label:', err)
    }
  }

  const handleDeleteLabel = async (labelId) => {
    try {
      // Remove the label from board's labels array
      const updatedLabels = board.labels.filter((label) => label.id !== labelId)

      // Remove the label from all tasks that have it
      const updatedGroups = board.groups.map((grp) => ({
        ...grp,
        tasks: grp.tasks.map((tsk) => ({
          ...tsk,
          labelIds: (tsk.labelIds || []).filter((id) => id !== labelId),
        })),
      }))

      // Update local state if this task had the deleted label
      if (taskLabelIds.includes(labelId)) {
        setTaskLabelIds(taskLabelIds.filter((id) => id !== labelId))
      }

      // Create updated board
      const updatedBoard = {
        ...board,
        labels: updatedLabels,
        groups: updatedGroups,
      }

      // Save to backend and update Redux
      await updateBoard(updatedBoard)

      console.log('Label deleted successfully')
    } catch (err) {
      console.error('Failed to delete label:', err)
    }
  }

  const handleCreateLabel = async (newLabel) => {
    try {
      // Add the new label to the board's labels array
      const updatedLabels = [...board.labels, newLabel]

      // Update the board with new labels
      const updatedBoard = { ...board, labels: updatedLabels }

      // Save to backend and update Redux
      await updateBoard(updatedBoard)

      console.log('Label created successfully')
    } catch (err) {
      console.error('Failed to create label:', err)
    }
  }

  const handleEditAttachment = (attachment) => {
    setEditingAttachment(attachment)
    setShowAttachmentMenu(null)
    // You can implement edit functionality here
  }

  const handleDeleteAttachment = (attachmentId) => {
    const updatedAttachments = (task.attachments || []).filter(
      (att) => att.id !== attachmentId
    )
    const updatedTask = { ...task, attachments: updatedAttachments }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
    setShowAttachmentMenu(null)
  }

  const handleAddAttachment = (newAttachment) => {
    const updatedAttachments = [...(task.attachments || []), newAttachment]
    const updatedTask = { ...task, attachments: updatedAttachments }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
  }

  const handleOpenFile = (fileUrl) => {
    window.open(fileUrl, '_blank')
  }

  const handleEditFile = (file) => {
    setEditingFile(file)
    setEditingFileName(file.name || file.title || '')
    setShowFileMenu(null)
  }

  const handleSaveFileName = () => {
    const updatedAttachments = (task.attachments || []).map((att) => {
      if (att.id === editingFile.id) {
        // Update the property that exists (name or title)
        if (att.name !== undefined) {
          return { ...att, name: editingFileName }
        } else {
          return { ...att, title: editingFileName }
        }
      }
      return att
    })
    const updatedTask = { ...task, attachments: updatedAttachments }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
    setEditingFile(null)
    setEditingFileName('')
  }

  const handleCancelFileEdit = () => {
    setEditingFile(null)
    setEditingFileName('')
  }

  const handleDeleteFile = (fileId) => {
    const updatedAttachments = (task.attachments || []).filter(
      (att) => att.id !== fileId
    )
    const updatedTask = { ...task, attachments: updatedAttachments }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
    setShowFileMenu(null)
  }

  const formatFileDate = (timestamp) => {
    const date = new Date(timestamp)
    return `Added ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}, ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`
  }

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
    } catch {
      return null
    }
  }

  const formatActivityDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return (
        date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }) +
        `, ${date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })}`
      )
    }
  }

  const getActivityList = () => {
    const activities = []

    // Add task comments as activities
    if (
      task.comments &&
      Array.isArray(task.comments) &&
      task.comments.length > 0
    ) {
      task.comments.forEach((comment) => {
        activities.push({
          id: comment.id,
          type: 'comment',
          text: comment.txt,
          createdAt: comment.createdAt,
          byMember: comment.byMember,
        })
      })
    }

    // Add relevant board activities for this task
    if (board.activities && board.activities.length > 0) {
      board.activities
        .filter((activity) => activity.task && activity.task.id === task.id)
        .forEach((activity) => {
          activities.push({
            id: activity.id,
            type: 'activity',
            text: activity.txt,
            createdAt: activity.createdAt,
            byMember: activity.byMember,
            task: activity.task,
            group: activity.group,
          })
        })
    }

    // Add task creation activity if we have byMember info
    if (task.byMember && task.createdAt) {
      activities.push({
        id: `created-${task.id}`,
        type: 'created',
        text: `added this card to ${group.title}`,
        createdAt: task.createdAt,
        byMember: task.byMember,
      })
    }

    // Sort by creation date (newest first)
    return activities.sort((a, b) => b.createdAt - a.createdAt)
  }

  const getInitials = (fullname) => {
    if (!fullname) return '?'
    return fullname
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Debug: Log task data to see attachment structure
  console.log('Task data:', task)
  console.log('Task attachments:', task.attachments)

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
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setLabelButtonPosition({
                      x: rect.left,
                      y: rect.bottom + 8,
                    })
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
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setDatesButtonPosition({
                      x: rect.left,
                      y: rect.bottom + 8,
                    })
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
                      >
                        {label.title}
                      </span>
                    ))}
                    <button
                      className="add-label-btn"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setLabelButtonPosition({
                          x: rect.left,
                          y: rect.bottom + 8,
                        })
                        setActiveButton('labels')
                        setShowLabelsModal(true)
                      }}
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
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setDatesButtonPosition({
                          x: rect.left,
                          y: rect.bottom + 8,
                        })
                        setShowDatesModal(true)
                      }}
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
              <div className="description-header">
                <div className="description-header-left">
                  <svg
                    className="description-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#5f6368"
                  >
                    <path d="M160-200v-80h400v80H160Zm0-160v-80h640v80H160Zm0-160v-80h640v80H160Zm0-160v-80h640v80H160Z" />
                  </svg>
                  <h3>Description</h3>
                </div>
                <button
                  className="section-action-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </div>
              {isEditing ? (
                <div className="description-edit">
                  <textarea
                    className="task-description-input"
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

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="task-details-attachments">
                <div className="attachments-header">
                  <div className="attachments-header-left">
                    <svg
                      className="attachments-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#5f6368"
                    >
                      <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
                    </svg>
                    <h3>Attachments</h3>
                  </div>
                  <button
                    className="section-action-btn"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setAttachmentButtonPosition({
                        x: rect.left,
                        y: rect.bottom + 8,
                      })
                      setActiveButton('attachment')
                      setShowAttachmentsModal(true)
                    }}
                  >
                    Add
                  </button>
                </div>

                {/* Links Section */}
                {task.attachments.filter((att) => att.type === 'link').length >
                  0 && (
                  <div className="attachment-section">
                    <h4 className="attachment-section-title">Links</h4>
                    <div className="attachment-links">
                      {task.attachments
                        .filter((att) => att.type === 'link')
                        .map((attachment) => (
                          <div
                            key={attachment.id}
                            className="attachment-link-item"
                          >
                            <div
                              className="attachment-link-content"
                              onClick={() =>
                                window.open(attachment.url, '_blank')
                              }
                            >
                              <div className="link-icon">
                                {getFaviconUrl(attachment.url) ? (
                                  <img
                                    src={getFaviconUrl(attachment.url)}
                                    alt="favicon"
                                    width="16"
                                    height="16"
                                    onError={(e) => {
                                      // Fallback to default icon if favicon fails
                                      e.target.style.display = 'none'
                                      e.target.parentElement.innerHTML = `
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                          <path d="M11.5 1.5L6.5 6.5M11.5 1.5L8 1.5M11.5 1.5V5M6 2.5H4.5C3.11929 2.5 2 3.61929 2 5V9.5C2 10.8807 3.11929 12 4.5 12H9C10.3807 12 11.5 10.8807 11.5 9.5V8" stroke="#ae2a19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>`
                                    }}
                                  />
                                ) : (
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                  >
                                    <path
                                      d="M11.5 1.5L6.5 6.5M11.5 1.5L8 1.5M11.5 1.5V5M6 2.5H4.5C3.11929 2.5 2 3.61929 2 5V9.5C2 10.8807 3.11929 12 4.5 12H9C10.3807 12 11.5 10.8807 11.5 9.5V8"
                                      stroke="#ae2a19"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="attachment-link-text">
                                {attachment.title || attachment.url}
                              </span>
                            </div>
                            <div className="attachment-actions">
                              <button
                                className="attachment-menu-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowAttachmentMenu(
                                    showAttachmentMenu === attachment.id
                                      ? null
                                      : attachment.id
                                  )
                                }}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <circle
                                    cx="8"
                                    cy="2.5"
                                    r="1.5"
                                    fill="#6b778c"
                                  />
                                  <circle
                                    cx="8"
                                    cy="8"
                                    r="1.5"
                                    fill="#6b778c"
                                  />
                                  <circle
                                    cx="8"
                                    cy="13.5"
                                    r="1.5"
                                    fill="#6b778c"
                                  />
                                </svg>
                              </button>
                              {showAttachmentMenu === attachment.id && (
                                <div className="attachment-actions-menu">
                                  <div className="menu-content">
                                    <button
                                      className="attachment-action-btn"
                                      onClick={() =>
                                        handleEditAttachment(attachment)
                                      }
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="attachment-action-btn"
                                      onClick={() =>
                                        handleDeleteAttachment(attachment.id)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Files Section */}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="attachment-section">
                    <h4 className="attachment-section-title">Files</h4>
                    <div className="attachment-files">
                      {task.attachments
                        .filter((att) => {
                          console.log('Attachment:', att)
                          return att.url && (att.type === 'file' || !att.type)
                        })
                        .map((file) => (
                          <div key={file.id} className="attachment-file-item">
                            <div className="file-content">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="file-thumbnail"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                }}
                              />
                              <div className="file-info">
                                <div className="file-name">
                                  {file.name || file.title || 'Untitled'}
                                </div>
                                <div className="file-date">
                                  {formatFileDate(
                                    file.createdAt || file.addedAt || Date.now()
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="file-actions">
                              <button
                                className="file-open-btn"
                                onClick={() => handleOpenFile(file.url)}
                                title="Open in new tab"
                              >
                                <svg viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146z" />
                                </svg>
                              </button>
                              <button
                                className="file-menu-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowFileMenu(
                                    showFileMenu === file.id ? null : file.id
                                  )
                                }}
                              >
                                <svg viewBox="0 0 16 16" fill="currentColor">
                                  <circle cx="8" cy="2.5" r="1.5" />
                                  <circle cx="8" cy="8" r="1.5" />
                                  <circle cx="8" cy="13.5" r="1.5" />
                                </svg>
                              </button>
                              {showFileMenu === file.id && (
                                <div className="file-edit-modal">
                                  <div className="file-edit-header">
                                    Edit attachment
                                  </div>
                                  {editingFile && editingFile.id === file.id ? (
                                    <>
                                      <input
                                        className="file-edit-input"
                                        value={editingFileName}
                                        onChange={(e) =>
                                          setEditingFileName(e.target.value)
                                        }
                                        placeholder="File name"
                                        autoFocus
                                      />
                                      <div className="file-edit-actions">
                                        <button
                                          className="file-edit-save-btn"
                                          onClick={handleSaveFileName}
                                        >
                                          Update
                                        </button>
                                        <button
                                          className="file-edit-cancel-btn"
                                          onClick={handleCancelFileEdit}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="file-edit-menu">
                                      <button
                                        className="file-edit-menu-item"
                                        onClick={() => handleEditFile(file)}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        className="file-edit-menu-item delete"
                                        onClick={() =>
                                          handleDeleteFile(file.id)
                                        }
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                {getActivityList().map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <span className="activity-avatar">
                      {getInitials(activity.byMember?.fullname)}
                    </span>
                    <div className="activity-content">
                      <div className="activity-text">
                        <b>{activity.byMember?.fullname || 'Unknown User'}</b>{' '}
                        {activity.type === 'comment' ? (
                          <>commented: "{activity.text}"</>
                        ) : (
                          activity.text
                        )}
                      </div>
                      <div className="activity-date">
                        {formatActivityDate(activity.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
                {getActivityList().length === 0 && (
                  <div className="no-activity">
                    <span>No activity yet.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLabelsModal && (
        <LabelsModal
          labels={board.labels}
          taskLabelIds={taskLabelIds}
          position={labelButtonPosition}
          onClose={() => {
            setShowLabelsModal(false)
            setActiveButton(null)
          }}
          onToggleLabel={handleToggleLabel}
          onSaveLabel={handleSaveLabel}
          onDeleteLabel={handleDeleteLabel}
          onCreateLabel={handleCreateLabel}
        />
      )}

      {showMembersModal && (
        <MembersModal
          boardMembers={board.members}
          cardMemberIds={task.memberIds || []}
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
          position={datesButtonPosition}
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
          onAddAttachment={handleAddAttachment}
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
