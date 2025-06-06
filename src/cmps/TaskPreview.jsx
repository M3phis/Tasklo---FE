import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EditIcon from '@atlaskit/icon/glyph/edit'
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle'
import MediaServicesPreselectedIcon from '@atlaskit/icon/glyph/media-services/preselected'
import editpenSvg from '../svg/editpen.svg'

export function TaskPreview({
  task,
  group,
  onRemoveTask,
  onUpdateTask,
  onOpenQuickEdit,
  isEmptyPlaceholder = false,
  board,
}) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const { boardId } = useParams()
  const isDone = task?.status === 'done'

  const handleTaskClick = (ev) => {
    // Prevent navigation if clicking the edit button
    if (ev.target.closest('.task-edit-btn')) {
      return
    }

    // Only navigate if we're not in a modal
    if (!document.querySelector('.modal-overlay')) {
      navigate(`/board/${boardId}/${group.id}/${task.id}`)
    }
  }

  const handleEditClick = (ev) => {
    ev.stopPropagation()
    onOpenQuickEdit(task, group)
  }

  const handleRemoveClick = (ev) => {
    ev.stopPropagation()
    if (onRemoveTask) {
      onRemoveTask(group.id, task.id)
    }
  }

  const handleDoneToggle = (ev) => {
    ev.stopPropagation()
    const updatedTask = {
      ...task,
      status: isDone ? 'todo' : 'done',
    }
    onUpdateTask(updatedTask, group.id)
  }

  if (isEmptyPlaceholder) {
    return (
      <div className="task-empty-placeholder">
        <p className="empty-message">No cards in this list</p>
      </div>
    )
  }

  return (
    <div
      className={`task-preview ${isDone ? 'task-done' : ''}`}
      onClick={handleTaskClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(task.style?.backgroundImage || task.style?.backgroundColor) && (
        <div
          className="task-cover"
          style={{
            backgroundColor: task.style.backgroundColor,
            backgroundImage: task.style.backgroundImage
              ? `url(${task.style.backgroundImage})`
              : 'none',
          }}
        >
          {task.style.backgroundImage && (
            <img
              src={task.style.backgroundImage}
              alt=""
              className="cover-image"
            />
          )}
        </div>
      )}

      <div className="task-content">
        {isHovered && (
          <button
            className="task-edit-btn"
            onClick={handleEditClick}
            title="Quick edit"
          >
            <EditIcon label="" size="small" />
          </button>
        )}

        <div className="task-header">
          {(isDone || isHovered) && (
            <button
              className="task-done-btn"
              onClick={handleDoneToggle}
              title={isDone ? 'Mark as undone' : 'Mark as done'}
            >
              {isDone ? (
                <CheckCircleIcon
                  label="Mark as incomplete"
                  primaryColor="#00875A"
                />
              ) : (
                <MediaServicesPreselectedIcon label="Mark as complete" />
              )}
            </button>
          )}

          <div className="task-title">{task.title}</div>
        </div>
      </div>
    </div>
  )
}
