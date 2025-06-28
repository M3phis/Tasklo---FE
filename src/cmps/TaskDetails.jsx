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
import { CoverModal } from './CoverModal'
import { AddToCardModal } from './AddToCardModal'

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
  const [attachmentButtonPosition, setAttachmentButtonPosition] = useState(null)
  const [showAddChecklistModal, setShowAddChecklistModal] = useState(false)
  const [checklistButtonPosition, setChecklistButtonPosition] = useState(null)
  const [activeButton, setActiveButton] = useState(null)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(null)
  const [editingAttachment, setEditingAttachment] = useState(null)
  const [showFileMenu, setShowFileMenu] = useState(null)
  const [editingFile, setEditingFile] = useState(null)
  const [editingFileName, setEditingFileName] = useState('')
  const [membersButtonPosition, setMembersButtonPosition] = useState(null)
  const [showCoverModal, setShowCoverModal] = useState(false)
  const [coverButtonPosition, setCoverButtonPosition] = useState(null)
  const [showAddToCardModal, setShowAddToCardModal] = useState(false)
  const [addToCardButtonPosition, setAddToCardButtonPosition] = useState(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(task?.title || '')

  const { handleUpdateTask } = useOutletContext()
  const dispatch = useDispatch()

  useEffect(() => {
    setTaskLabelIds(task?.labelIds || [])
    setTitleValue(task?.title || '')
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

  const handleDoneToggle = (ev) => {
    ev.stopPropagation()

    const isDone = task?.status === 'done'
    const updatedTask = {
      ...task,
      status: isDone ? 'in-progress' : 'done',
      ...(isDone ? {} : { completedAt: new Date().toISOString() }),
    }

    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }

    handleUpdateTask(updatedGroup)
  }

  const handleTitleClick = () => {
    setIsEditingTitle(true)
  }

  const handleTitleSave = async () => {
    if (titleValue.trim() === '') return

    const updatedTask = { ...task, title: titleValue.trim() }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }

    handleUpdateTask(updatedGroup)
    setIsEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setTitleValue(task?.title || '')
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleTitleSave()
    }
    if (e.key === 'Escape') {
      handleTitleCancel()
    }
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
  const hasMembers = members.length > 0
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

  const handleUpdateCover = (coverData) => {
    const updatedTask = {
      ...task,
      style: {
        ...task.style,
        ...(coverData.type === 'color'
          ? {
              backgroundColor: coverData.value,
              backgroundImage: undefined,
              background: undefined,
              coverSize: coverData.size,
            }
          : {
              background: coverData.value,
              backgroundColor: undefined,
              backgroundImage: undefined,
              coverSize: coverData.size,
            }),
      },
    }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
    // Don't close modal - let user make multiple selections
  }

  const handleRemoveCover = () => {
    const updatedTask = {
      ...task,
      style: {
        ...task.style,
        backgroundColor: undefined,
        backgroundImage: undefined,
        background: undefined,
        coverSize: undefined,
      },
    }
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    handleUpdateTask(updatedGroup)
    // Don't close modal
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
    if (!fullname) return ''
    return fullname
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
  }

  const getBackgroundUrl = () => {
    if (!task.style?.background) return null
    return typeof task.style.background === 'string'
      ? task.style.background
      : task.style.background?.url
  }

  // Debug: Log task data to see attachment structure
  console.log('Task data:', task)
  console.log('Task attachments:', task.attachments)

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content task-details-modal">
        {/* HEADER */}
        <div
          className={`task-details-header ${
            task.style?.backgroundColor ||
            (getBackgroundUrl() &&
              (getBackgroundUrl().startsWith('#') ||
                getBackgroundUrl().startsWith('rgb') ||
                getBackgroundUrl().includes('images.unsplash.com'))) ||
            task.style?.backgroundImage
              ? 'has-cover'
              : ''
          }`}
          style={{
            ...(task.style?.backgroundColor
              ? {
                  backgroundColor: task.style.backgroundColor,
                  height: '116px',
                }
              : {}),
            ...(getBackgroundUrl()
              ? getBackgroundUrl().startsWith('#') ||
                getBackgroundUrl().startsWith('rgb')
                ? {
                    backgroundColor: getBackgroundUrl(),
                    height: '116px',
                  }
                : getBackgroundUrl().includes('images.unsplash.com')
                ? {
                    backgroundImage: `url(${getBackgroundUrl()})`,
                    backgroundSize:
                      task.style?.coverSize === 'centered'
                        ? 'contain'
                        : 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '160px',
                  }
                : {}
              : {}),
            ...(task.style?.backgroundImage
              ? {
                  backgroundImage: `url(${task.style.backgroundImage})`,
                  backgroundSize:
                    task.style?.coverSize === 'centered' ? 'contain' : 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  height: '160px',
                }
              : {}),
          }}
          onMouseEnter={(e) => {
            if (
              task.style?.backgroundColor ||
              (getBackgroundUrl() &&
                (getBackgroundUrl().startsWith('#') ||
                  getBackgroundUrl().startsWith('rgb') ||
                  getBackgroundUrl().includes('images.unsplash.com'))) ||
              task.style?.backgroundImage
            ) {
              const removeCoverBtn = e.currentTarget.querySelector(
                '.header-remove-cover-btn'
              )
              if (removeCoverBtn) removeCoverBtn.style.display = 'block'
            }
          }}
          onMouseLeave={(e) => {
            const removeCoverBtn = e.currentTarget.querySelector(
              '.header-remove-cover-btn'
            )
            if (removeCoverBtn) removeCoverBtn.style.display = 'none'
          }}
        >
          <div className="task-details-header-left">
            <div className="task-list-title-badge">{group.title}</div>
          </div>
          <div
            className="task-details-header-right"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <button
              className="cover-btn"
              onClick={(e) => {
                if (showCoverModal) {
                  setShowCoverModal(false)
                } else {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setCoverButtonPosition({
                    x: rect.left,
                    y: rect.bottom + 4,
                  })
                  setShowCoverModal(true)
                }
              }}
              title="Cover"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f4f5f7')}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = 'transparent')
              }
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3z"
                  stroke="#44546F"
                  strokeWidth="1.5"
                />
                <path
                  d="m5 8 2-2 1.5 1.5L11 5l3 3v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1l3-3z"
                  fill="#44546F"
                />
                <circle cx="6.5" cy="5.5" r="1" fill="#44546F" />
              </svg>
            </button>
            <button
              className="task-details-close-btn"
              onClick={handleClose}
              title="Close"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f4f5f7')}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = 'transparent')
              }
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M13.5 1.5L1.5 13.5M1.5 1.5l12 12"
                  stroke="#6b778c"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Hover Remove Cover Button */}
          {(task.style?.backgroundColor ||
            (getBackgroundUrl() &&
              (getBackgroundUrl().startsWith('#') ||
                getBackgroundUrl().startsWith('rgb') ||
                getBackgroundUrl().includes('images.unsplash.com'))) ||
            task.style?.backgroundImage) && (
            <button
              className="header-remove-cover-btn"
              onClick={handleRemoveCover}
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '3px',
                fontSize: '12px',
                color: '#172B4D',
                fontWeight: 500,
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = 'rgba(255,255,255,0.2)')
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = 'transparent')
              }
            >
              Remove cover
            </button>
          )}
        </div>

        <div className="task-details-layout">
          <div className="task-details-main">
            <div
              className={`task-details-title-row ${
                task?.status === 'done' ? 'task-done' : ''
              }`}
            >
              <button
                className="task-done-checkbox"
                onClick={handleDoneToggle}
                title={
                  task?.status === 'done' ? 'Mark incomplete' : 'Mark complete'
                }
              >
                {task?.status === 'done' ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#4CAF50" />
                    <path
                      d="M12.326 5.48l-1.152-.96L6.75 9.828L4.826 7.52l-1.152.96l2.5 3a.75.75 0 0 0 1.152 0Z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="#626F86"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                )}
              </button>
              {isEditingTitle ? (
                <textarea
                  className="task-title-input editing"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={handleTitleSave}
                  rows={1}
                  autoFocus
                  style={{
                    height: 'auto',
                    minHeight: '36px',
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto'
                    e.target.style.height = e.target.scrollHeight + 'px'
                  }}
                />
              ) : (
                <div className="task-title-display" onClick={handleTitleClick}>
                  {task.title}
                </div>
              )}
            </div>

            <div className="task-details-actions-row">
              <button
                className={activeButton === 'add' ? 'active' : ''}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setAddToCardButtonPosition({
                    x: rect.left,
                    y: rect.bottom + 8,
                  })
                  setActiveButton('add')
                  setShowAddToCardModal(true)
                }}
              >
                + Add
              </button>
              {!hasMembers && (
                <button
                  className={`members-btn ${
                    activeButton === 'members' ? 'active' : ''
                  }`}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setMembersButtonPosition({
                      x: rect.left,
                      y: rect.bottom + 8,
                    })
                    setActiveButton('members')
                    setShowMembersModal(true)
                  }}
                >
                  Members
                </button>
              )}
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
                      viewBox="0 0 24 24"
                      style={{ marginRight: 4 }}
                      fill={activeButton === 'dates' ? 'white' : '#44546F'}
                    >
                      <path d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V6Z" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
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
                    viewBox="0 0 24 24"
                    style={{ marginRight: 4 }}
                    fill={activeButton === 'checklist' ? 'white' : '#44546F'}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13C20 12.4477 19.5523 12 19 12C18.4477 12 18 12.4477 18 13V18H6V6L16 6C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4H6ZM8.73534 10.3223C8.36105 9.91618 7.72841 9.89038 7.3223 10.2647C6.91619 10.639 6.89039 11.2716 7.26467 11.6777L10.8768 15.597C11.4143 16.1231 12.2145 16.1231 12.7111 15.6264L13.0754 15.2683C13.3699 14.9785 13.6981 14.6556 14.0516 14.3075C15.0614 13.313 16.0713 12.3169 17.014 11.3848L17.0543 11.3449C18.7291 9.68869 20.0004 8.42365 20.712 7.70223C21.0998 7.30904 21.0954 6.67589 20.7022 6.28805C20.309 5.90022 19.6759 5.90457 19.2881 6.29777C18.5843 7.01131 17.3169 8.27244 15.648 9.92281L15.6077 9.96263C14.6662 10.8937 13.6572 11.8889 12.6483 12.8825L11.8329 13.6851L8.73534 10.3223Z"
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
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    style={{ marginRight: 4 }}
                    fill={activeButton === 'attachment' ? 'white' : '#44546F'}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.6426 17.9647C10.1123 19.46 7.62736 19.4606 6.10092 17.9691C4.57505 16.478 4.57769 14.0467 6.10253 12.5566L13.2505 5.57184C14.1476 4.6952 15.5861 4.69251 16.4832 5.56921C17.3763 6.44184 17.3778 7.85135 16.4869 8.72199L9.78361 15.2722C9.53288 15.5172 9.12807 15.5163 8.86954 15.2636C8.61073 15.0107 8.60963 14.6158 8.86954 14.3618L15.0989 8.27463C15.4812 7.90109 15.4812 7.29546 15.0989 6.92192C14.7167 6.54838 14.0969 6.54838 13.7146 6.92192L7.48523 13.0091C6.45911 14.0118 6.46356 15.618 7.48523 16.6163C8.50674 17.6145 10.1511 17.6186 11.1679 16.6249L17.8712 10.0747C19.5274 8.45632 19.5244 5.83555 17.8676 4.2165C16.2047 2.59156 13.5266 2.59657 11.8662 4.21913L4.71822 11.2039C2.42951 13.4404 2.42555 17.083 4.71661 19.3218C7.00774 21.5606 10.7323 21.5597 13.0269 19.3174L19.7133 12.7837C20.0956 12.4101 20.0956 11.8045 19.7133 11.431C19.331 11.0574 18.7113 11.0574 18.329 11.431L11.6426 17.9647Z"
                    />
                  </svg>
                  Attachment
                </span>
              </button>
            </div>

            <div className="task-details-info">
              {hasMembers && (
                <div className="task-details-members-section">
                  <span className="section-header">Members</span>
                  <div className="task-members-list">
                    {members.map((memberId) => {
                      const member = board.members.find(
                        (m) => m._id === memberId
                      )
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
                          {member?.imgUrl ? (
                            <img
                              src={member.imgUrl}
                              alt={member.fullname}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            initials
                          )}
                        </span>
                      )
                    })}
                    <button
                      className="add-member-btn"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setMembersButtonPosition({
                          x: rect.left,
                          y: rect.bottom + 8,
                        })
                        setActiveButton('members')
                        setShowMembersModal(true)
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

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
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#5f6368"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.6426 17.9647C10.1123 19.46 7.62736 19.4606 6.10092 17.9691C4.57505 16.478 4.57769 14.0467 6.10253 12.5566L13.2505 5.57184C14.1476 4.6952 15.5861 4.69251 16.4832 5.56921C17.3763 6.44184 17.3778 7.85135 16.4869 8.72199L9.78361 15.2722C9.53288 15.5172 9.12807 15.5163 8.86954 15.2636C8.61073 15.0107 8.60963 14.6158 8.86954 14.3618L15.0989 8.27463C15.4812 7.90109 15.4812 7.29546 15.0989 6.92192C14.7167 6.54838 14.0969 6.54838 13.7146 6.92192L7.48523 13.0091C6.45911 14.0118 6.46356 15.618 7.48523 16.6163C8.50674 17.6145 10.1511 17.6186 11.1679 16.6249L17.8712 10.0747C19.5274 8.45632 19.5244 5.83555 17.8676 4.2165C16.2047 2.59156 13.5266 2.59657 11.8662 4.21913L4.71822 11.2039C2.42951 13.4404 2.42555 17.083 4.71661 19.3218C7.00774 21.5606 10.7323 21.5597 13.0269 19.3174L19.7133 12.7837C20.0956 12.4101 20.0956 11.8045 19.7133 11.431C19.331 11.0574 18.7113 11.0574 18.329 11.431L11.6426 17.9647Z"
                      />
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
                    <h4 className="attachment-section-title">Files & Images</h4>
                    <div className="attachment-files">
                      {task.attachments
                        .filter((att) => {
                          console.log('Attachment:', att)
                          return (
                            att.url &&
                            (att.type === 'file' ||
                              att.type === 'image' ||
                              !att.type)
                          )
                        })
                        .map((file) => (
                          <div key={file.id} className="attachment-file-item">
                            <div className="file-content">
                              <img
                                src={
                                  file.type === 'image'
                                    ? file.url.replace(
                                        '/upload/',
                                        '/upload/w_100,h_100,c_fill/'
                                      )
                                    : file.url
                                }
                                alt={file.name || file.title}
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
                      {activity.byMember?.imgUrl ? (
                        <img
                          src={activity.byMember.imgUrl}
                          alt={activity.byMember.fullname}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        getInitials(activity.byMember?.fullname)
                      )}
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

      {showCoverModal && (
        <CoverModal
          task={task}
          position={coverButtonPosition}
          onClose={() => setShowCoverModal(false)}
          onUpdateCover={handleUpdateCover}
          onRemoveCover={handleRemoveCover}
        />
      )}

      {showLabelsModal && (
        <LabelsModal
          labels={board.labels}
          taskLabelIds={taskLabelIds}
          position={labelButtonPosition}
          onClose={() => {
            setShowLabelsModal(false)
            if (!showAddToCardModal) {
              setActiveButton(null)
            }
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
          position={membersButtonPosition}
          onClose={() => {
            setShowMembersModal(false)
            if (!showAddToCardModal) {
              setActiveButton(null)
            }
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
            if (!showAddToCardModal) {
              setActiveButton(null)
            }
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
            if (!showAddToCardModal) {
              setActiveButton(null)
            }
          }}
          onAddAttachment={handleAddAttachment}
        />
      )}

      {showAddChecklistModal && (
        <AddChecklistModal
          position={checklistButtonPosition}
          onClose={() => {
            setShowAddChecklistModal(false)
            if (!showAddToCardModal) {
              setActiveButton(null)
            }
          }}
          onAddChecklist={handleAddChecklist}
        />
      )}

      {showAddToCardModal && (
        <AddToCardModal
          position={addToCardButtonPosition}
          onClose={() => {
            setShowAddToCardModal(false)
            setActiveButton(null)
          }}
          onOpenLabels={(position) => {
            setLabelButtonPosition(position)
            setShowLabelsModal(true)
          }}
          onOpenDates={(position) => {
            setDatesButtonPosition(position)
            setShowDatesModal(true)
          }}
          onOpenChecklist={(position) => {
            setChecklistButtonPosition(position)
            setShowAddChecklistModal(true)
          }}
          onOpenMembers={(position) => {
            setMembersButtonPosition(position)
            setShowMembersModal(true)
          }}
          onOpenAttachment={(position) => {
            setAttachmentButtonPosition(position)
            setShowAttachmentsModal(true)
          }}
        />
      )}
    </div>
  )
}
