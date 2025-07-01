import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TaskQuickEdit } from './TaskQuickEdit'

import EditIcon from '@atlaskit/icon/core/edit'
import DeleteIcon from '@atlaskit/icon/core/delete'
import CheckCircleIcon from '@atlaskit/icon/core/check-circle'
import MediaServicesPreselectedIcon from '@atlaskit/icon/glyph/media-services/preselected'
import ClockIcon from '@atlaskit/icon/core/clock'
import AttachmentIcon from '@atlaskit/icon/core/attachment'

export function TaskPreview({
  task,
  group,
  board,
  onRemoveTask,
  onUpdateTask,
  isLabelsExtended,
  setIsLabelsExtended,
  isEditing = false,
  editableTitle = '',
  onTitleChange = null,
  onSaveTitle = null,
  onCancelEdit = null,
  inputRef = null,
  hasActiveModal = false,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false)
  const [quickEditPosition, setQuickEditPosition] = useState({ x: 0, y: 0 })
  const { boardId } = useParams()
  const isDone = task?.status === 'done'

  const navigate = useNavigate()

  function handleTaskClick(ev) {
    if (
      ev.target.closest('.task-edit-btn') ||
      ev.target.closest('.task-edit-btn') ||
      ev.target.closest('.task-delete-btn') ||
      ev.target.closest('.task-done-btn') ||
      ev.target.closest('.quick-edit-backdrop') ||
      ev.target.closest('.task-quick-edit') ||
      ev.target.closest('.task-label') ||
      isQuickEditOpen ||
      hasActiveModal
    ) {
      return
    }

    if (!document.querySelector('.modal-overlay')) {
      navigate(`/board/${boardId}/${group.id}/${task.id}`)
    }
  }

  function handleEditClick(ev) {
    ev.stopPropagation()

    const taskCard = ev.currentTarget.closest('.task-preview')
    const rect = taskCard.getBoundingClientRect()

    setQuickEditPosition({
      x: rect.left,
      y: rect.top,
    })
    setIsQuickEditOpen(true)
    console.log('TaskQuickEdit opened at position:', {
      x: rect.left,
      y: rect.top,
    })
  }

  function handleCloseQuickEdit() {
    setIsQuickEditOpen(false)
    console.log('TaskQuickEdit closed')
  }

  function handleRemoveClick(ev) {
    ev.stopPropagation()
    if (onRemoveTask) {
      onRemoveTask(group.id, task.id)
    }
  }

  function handleDoneToggle(ev) {
    ev.stopPropagation()

    const updatedTask = {
      ...task,
      status: isDone ? 'in-progress' : 'done',
      ...(isDone ? {} : { completedAt: new Date().toISOString() }),
    }

    const updatedGroup = {
      ...group,
      tasks: group.tasks.map(function (t) {
        return t.id === task.id ? updatedTask : t
      }),
    }

    onUpdateTask(updatedGroup)
  }

  function handleLabelClick(ev) {
    ev.stopPropagation()
    setIsLabelsExtended(!isLabelsExtended)
  }

  function getDateStatus() {
    if (!task.dueDate) return ''

    if (task.status === 'done') return 'done'

    const dueDate = new Date(task.dueDate)
    const now = new Date()
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    if (dueDate < now) return 'overdue'
    if (dueDate < oneDayFromNow) return 'due-soon'
    return ''
  }

  function formatDate() {
    if (!task.dueDate) return null
    const date = new Date(task.dueDate)
    return `${date.toLocaleDateString('en-US', {
      month: 'short',
    })} ${date.getDate()}`
  }

  function isImageUrl(url) {
    if (!url || typeof url !== 'string') return false
    return (
      url.startsWith('http') ||
      url.startsWith('https') ||
      url.startsWith('data:') ||
      url.includes('images.unsplash.com') ||
      url.includes('cloudinary.com')
    )
  }

  function getBackgroundUrl() {
    if (!task.style?.background) return null
    return typeof task.style.background === 'string'
      ? task.style.background
      : task.style.background?.url
  }

  function getFirstImageAttachment() {
    if (!task.attachments || !Array.isArray(task.attachments)) return null
    return task.attachments.find((attachment) => isImageUrl(attachment.url))
  }

  function hasValidCover() {
    const backgroundUrl = getBackgroundUrl()
    return (
      task.style?.backgroundColor ||
      (backgroundUrl &&
        (backgroundUrl.startsWith('#') ||
          backgroundUrl.startsWith('rgb') ||
          backgroundUrl.includes('images.unsplash.com'))) ||
      task.style?.backgroundImage
    )
  }

  function getAttachmentCount() {
    if (!task.attachments || !Array.isArray(task.attachments)) return 0
    return task.attachments.length
  }

  function getChecklistCount() {
    if (!task.checklists || !Array.isArray(task.checklists))
      return { completed: 0, total: 0 }

    let total = 0
    let completed = 0

    task.checklists.forEach((checklist) => {
      if (checklist.todos && Array.isArray(checklist.todos)) {
        total += checklist.todos.length
        completed += checklist.todos.filter((item) => item.isDone).length
      }
    })

    return { completed, total }
  }

  function hasChecklist() {
    const { total } = getChecklistCount()
    return total > 0
  }

  function getCommentsCount() {
    if (!task.comments || !Array.isArray(task.comments)) return 0
    return task.comments.length
  }

  function hasComments() {
    return getCommentsCount() > 0
  }

  const hasCover = hasValidCover() || getFirstImageAttachment()

  return (
    <>
      <div
        className={`task-preview ${isDone ? 'task-done' : ''} ${isEditing ? 'editing' : ''
          }`}
        onClick={handleTaskClick}
        onMouseEnter={function () {
          setIsHovered(true)
        }}
        onMouseLeave={function () {
          setIsHovered(false)
        }}
      >
        {hasValidCover() && (
          <div
            className={`task-cover ${(getBackgroundUrl() &&
              getBackgroundUrl().includes('images.unsplash.com')) ||
              task.style?.backgroundImage
              ? 'has-image'
              : 'has-color'
              }`}
            style={{
              backgroundColor:
                task.style?.backgroundColor ||
                (getBackgroundUrl() &&
                  (getBackgroundUrl().startsWith('#') ||
                    getBackgroundUrl().startsWith('rgb'))
                  ? getBackgroundUrl()
                  : !isImageUrl(getBackgroundUrl())
                    ? getBackgroundUrl()
                    : '#FFFFFF'),
              backgroundImage: task.style?.backgroundImage
                ? `url(${task.style.backgroundImage})`
                : isImageUrl(getBackgroundUrl())
                  ? `url(${getBackgroundUrl()})`
                  : 'none',
              backgroundSize:
                task.style?.coverSize === 'centered' ? 'contain' : 'cover',
            }}
          >
            {((getBackgroundUrl() &&
              getBackgroundUrl().includes('images.unsplash.com')) ||
              task.style?.backgroundImage) && (
                <img
                  src={task.style?.backgroundImage || getBackgroundUrl()}
                  alt=""
                  className="cover-image"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
          </div>
        )}

        {!hasValidCover() && getFirstImageAttachment() && (
          <div className="task-attachment-preview">
            <img
              src={getFirstImageAttachment().url}
              alt={getFirstImageAttachment().title || 'Attachment'}
              className="attachment-preview-image"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        )}

        {isHovered && !isEditing && (
          <>
            <button
              className={`task-edit-btn ${hasCover ? 'task-cover-btn' : ''}`}
              onClick={handleEditClick}
              title="Edit card"
            >
              <EditIcon label="Edit card" />
            </button>

            {isDone && (
              <button
                className={`task-delete-btn ${hasCover ? 'task-cover-btn' : ''
                  }`}
                onClick={handleRemoveClick}
                title="Delete card"
              >
                <DeleteIcon label="Delete card" />
              </button>
            )}
          </>
        )}

        <div className="task-content">
          {!hasValidCover() &&
            !getFirstImageAttachment() &&
            isHovered &&
            !isEditing && (
              <>
                <button
                  className="task-edit-btn"
                  onClick={handleEditClick}
                  title="Edit card"
                >
                  <EditIcon label="Edit card" color="#172B4D" />
                </button>

                {isDone && (
                  <button
                    className="task-delete-btn"
                    onClick={handleRemoveClick}
                    title="Delete card"
                  >
                    <DeleteIcon label="Delete card" color="#172B4D" />
                  </button>
                )}
              </>
            )}

          {task.labelIds && task.labelIds.length > 0 && (
            <div className="task-labels">
              {board.labels
                .filter((label) => task.labelIds.includes(label.id))
                .map((label) => (
                  <div
                    key={label.id}
                    className={`task-label ${!isLabelsExtended ? 'collapsed' : ''
                      }`}
                    style={{
                      backgroundColor: label.color || '#b3bac5',
                    }}
                    onClick={handleLabelClick}
                    title={!isLabelsExtended ? label.title : ''}
                  >
                    <span className="label-text">
                      {isLabelsExtended ? label.title : ''}
                    </span>
                  </div>
                ))}
            </div>
          )}

          <div className="task-header">
            {(isDone || isHovered) && !isEditing && (
              <button
                className="task-done-btn"
                onClick={handleDoneToggle}
                title={isDone ? 'Mark incomplete' : 'Mark complete'}
              >
                {isDone ? (
                  <CheckCircleIcon label="Mark incomplete" />
                ) : (
                  <MediaServicesPreselectedIcon
                    label="Mark complete"
                    primaryColor="#626F86"
                  />
                )}
              </button>
            )}

            {isEditing ? (
              <div className="task-title-edit">
                <textarea
                  ref={inputRef}
                  className="card-title-editable"
                  value={editableTitle}
                  onChange={onTitleChange}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Escape') onCancelEdit()
                    if (ev.key === 'Enter' && !ev.shiftKey) {
                      ev.preventDefault()
                      onSaveTitle()
                    }
                  }}
                  autoFocus
                  rows={1}
                />
              </div>
            ) : (
              <div className="task-title">{task.title}</div>
            )}
          </div>

          <div className="task-badges-section">
            {(task.dueDate ||
              task.description ||
              getAttachmentCount() > 0 ||
              hasChecklist()) && (
                <div className="task-badges">
                  {task.dueDate && (
                    <div className={`task-badge date-badge ${getDateStatus()}`}>
                      <ClockIcon label="Due date" primaryColor=" #44546F" />
                      <span>{formatDate()}</span>
                    </div>
                  )}

                  {task.description && (
                    <div className="task-badge description-badge">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill=" #44546F"
                      >
                        <path d="M160-200v-80h400v80H160Zm0-160v-80h640v80H160Zm0-160v-80h640v80H160Zm0-160v-80h640v80H160Z" />
                      </svg>
                    </div>
                  )}

                  {hasComments() && (
                    <div className="task-badge comments-badge">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16 17H12.5L8.28037 20.4014C6.97772 21.4869 5 20.5606 5 18.865V16.1973C3.2066 15.1599 2 13.2208 2 11C2 7.68629 4.68629 5 8 5H16C19.3137 5 22 7.68629 22 11C22 14.3137 19.3137 17 16 17ZM16 7H8C5.79086 7 4 8.79086 4 11C4 12.8638 5.27477 14.4299 7 14.874V19L12 15H16C18.2091 15 20 13.2091 20 11C20 8.79086 18.2091 7 16 7Z"
                          fill=" #44546F"
                        ></path>
                      </svg>
                      <span>{getCommentsCount()}</span>
                    </div>
                  )}

                  {getAttachmentCount() > 0 && (
                    <div className="task-badge attachment-badge">
                      <AttachmentIcon
                        label="Attachments"
                        size="small"
                        primaryColor=" #44546F"
                      />
                      <span>{getAttachmentCount()}</span>
                    </div>
                  )}

                  {hasChecklist() && (
                    <div
                      className={`task-badge checklist-badge ${getChecklistCount().completed ===
                        getChecklistCount().total &&
                        getChecklistCount().total > 0
                        ? 'completed'
                        : ''
                        }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill=" #44546F"
                      >
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q8 0 15 1.5t14 4.5l-74 74H200v560h560v-266l80-80v346q0 33-23.5 56.5T760-120H200Zm261-160L235-506l56-56 170 170 367-367 57 55-424 424Z" />
                      </svg>
                      <span>
                        {getChecklistCount().completed}/
                        {getChecklistCount().total}
                      </span>
                    </div>
                  )}
                </div>
              )}
          </div>

          <div className="task-members-section">
            {task.memberIds && task.memberIds.length > 0 && (
              <div className="task-members">
                {board.members
                  .filter((member) => task.memberIds.includes(member._id))
                  .map((member) => (
                    <div key={member._id} className="task-member-avatar">
                      {member.imgUrl ? (
                        <img src={member.imgUrl} alt={member.fullname} />
                      ) : (
                        <div className="member-initials">
                          {member.fullname?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="task-edit-controls">
            <button className="save-card-title-edit-btn" onClick={onSaveTitle}>
              Save
            </button>
          </div>
        )}
      </div>

      {isQuickEditOpen && !isEditing && (
        <TaskQuickEdit
          task={task}
          group={group}
          board={board}
          position={quickEditPosition}
          onClose={handleCloseQuickEdit}
          onUpdateTask={onUpdateTask}
          onRemoveTask={onRemoveTask}
          isLabelsExtended={isLabelsExtended}
        />
      )}
    </>
  )
}
