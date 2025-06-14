import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TaskQuickEdit } from './TaskQuickEdit'

import EditIcon from '@atlaskit/icon/core/edit'
import DeleteIcon from '@atlaskit/icon/core/delete'
import CheckCircleIcon from '@atlaskit/icon/core/check-circle'
import MediaServicesPreselectedIcon from '@atlaskit/icon/glyph/media-services/preselected'
import ClockIcon from '@atlaskit/icon/core/clock';
import TextLengthenIcon from '@atlaskit/icon-lab/core/text-lengthen';
import AttachmentIcon from '@atlaskit/icon/core/attachment';

export function TaskPreview({
  task,
  group,
  board,
  onRemoveTask,
  onUpdateTask,
  isLabelsExtended,
  setIsLabelExtended
}) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false)
  const [quickEditPosition, setQuickEditPosition] = useState({ x: 0, y: 0 })

  const { boardId } = useParams()
  const isDone = task?.status === 'done'

  function handleTaskClick(ev) {
    if (ev.target.closest('.task-edit-btn') ||
      ev.target.closest('.task-delete-btn') ||
      ev.target.closest('.task-done-btn') ||
      isQuickEditOpen) {
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
      y: rect.top
    })
    setIsQuickEditOpen(true)
    console.log('TaskQuickEdit opened at position:', { x: rect.left, y: rect.top })
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
      tasks: group.tasks.map(function (t) { return t.id === task.id ? updatedTask : t }),
    }

    onUpdateTask(updatedGroup)
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
    return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`
  }

  function isImageUrl(url) {
    if (!url || typeof url !== 'string') return false
    return url.startsWith('http') || url.startsWith('https') || url.startsWith('data:')
  }

  function getAttachmentCount() {
    if (!task.attachments || !Array.isArray(task.attachments)) return 0
    return task.attachments.length
  }

  function isAttachmentImage(attachment) {
    if (!attachment.url) return false
    const url = attachment.url.toLowerCase()
    return url.includes('.jpg') || url.includes('.jpeg') ||
      url.includes('.png') || url.includes('.gif') ||
      url.includes('.webp') || url.includes('.svg') ||
      url.includes('image')
  }



  return (
    <>
      <div
        className={`task-preview ${isDone ? 'task-done' : ''}`}
        onClick={handleTaskClick}
        onMouseEnter={function () { setIsHovered(true) }}
        onMouseLeave={function () { setIsHovered(false) }}
      >
        {(task.style?.backgroundImage || task.style?.backgroundColor || task.style?.background) && (
          <div
            className={`task-cover ${isImageUrl(task.style?.background) || task.style?.backgroundImage ? 'has-image' : 'has-color'}`}
            style={{
              backgroundColor: !isImageUrl(task.style?.background)
                ? (task.style.backgroundColor || task.style.background)
                : '#FFFFFF',
              backgroundImage: task.style.backgroundImage
                ? `url(${task.style.backgroundImage})`
                : isImageUrl(task.style?.background)
                  ? `url(${task.style.background})`
                  : 'none',
              backgroundSize: isImageUrl(task.style?.background) || task.style?.backgroundImage ? 'contain' : 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {(task.style.backgroundImage || isImageUrl(task.style?.background)) && (
              <img
                src={task.style.backgroundImage || task.style.background}
                alt=""
                className="cover-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
        )}

        <div className="task-content">
          {isHovered && (
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
                .filter(label => task.labelIds.includes(label.id))
                .map(label => (
                  <div
                    key={label.id}
                    className={`task-label ${!isLabelsExtended ? 'collapsed' : ''}`}
                    style={{
                      backgroundColor: label.color || '#b3bac5'
                    }}
                    onClick={(ev) => {
                      ev.stopPropagation()
                      setIsLabelExtended(!isLabelsExtended)
                    }}
                  >
                    <span>{isLabelsExtended ? label.title : ''}</span>
                  </div>
                ))}
            </div>
          )}

          <div className="task-header">
            {(isDone || isHovered) && (
              <button
                className="task-done-btn"
                onClick={handleDoneToggle}
                title={isDone ? 'Mark as undone' : 'Mark as done'}
              >
                {isDone ? (
                  <CheckCircleIcon label="Mark as incomplete" />
                ) : (
                  <MediaServicesPreselectedIcon label="Mark as complete" />
                )}
              </button>
            )}

            <div className="task-title">{task.title}</div>
          </div>

          <div className="task-info">
            <div className="task-badges">
              {task.dueDate && (
                <div className={`task-badge date-badge ${getDateStatus()}`}>
                  <ClockIcon label="Due date" color="currentColor" />
                  <span>{formatDate()}</span>
                </div>
              )}

              {task.description && (
                <div className="task-badge">
                  <TextLengthenIcon label="TextLengthenIcon" color="currentColor" />
                </div>
              )}

              {getAttachmentCount() > 0 && (
                <div className="task-badge attachment-badge">
                  <AttachmentIcon label="Attachments" size="small" />
                  <span>{getAttachmentCount()}</span>
                </div>
              )}
            </div>

            {task.memberIds && task.memberIds.length > 0 && (
              <div className="task-members">
                {board.members
                  .filter(member => task.memberIds.includes(member._id))
                  .map(member => (
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
      </div>

      {isQuickEditOpen && (
        <TaskQuickEdit
          task={task}
          group={group}
          board={board}
          position={quickEditPosition}
          onClose={handleCloseQuickEdit}
          onUpdateTask={onUpdateTask}
          onRemoveTask={onRemoveTask}
          isLabelsExtended={isLabelsExtended}
          setIsLabelExtended={setIsLabelExtended}
        />
      )}
    </>
  )
}