import { useState } from 'react'
import { useParams } from 'react-router-dom'
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
}) {
  const [isHovered, setIsHovered] = useState(false)
  const { boardId } = useParams()
  const isDone = task?.status === 'done'

  function handleTaskClick(e) {
    if (isEmptyPlaceholder) return
    if (
      e.target.closest('.task-edit-btn') ||
      e.target.closest('.remove-task-btn') ||
      e.target.closest('.task-done-btn')
    ) {
      return
    }
    console.log('Open task details for:', task.title)
  }

  function handleRemoveClick(e) {
    e.stopPropagation()
    if (onRemoveTask) {
      onRemoveTask(group.id, task.id)
    }
  }

  function handleDoneToggle(e) {
    e.stopPropagation()

    const updatedTask = {
      ...task,
      status: isDone ? 'in-progress' : 'done',
      ...(isDone ? {} : { completedAt: new Date().toISOString() }),
    }

    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }

    onUpdateTask(updatedGroup)
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
      <div className="task-content">
        {isHovered && (
          <button
            className="task-edit-btn"
            onClick={handleRemoveClick}
            title="Quick edit"
          >
            <img src={editpenSvg} alt="Edit" width="14" height="14" />
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
