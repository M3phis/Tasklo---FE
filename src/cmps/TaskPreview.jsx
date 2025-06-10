import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EditIcon from '@atlaskit/icon/core/edit';
import DeleteIcon from '@atlaskit/icon/core/delete';
import CheckCircleIcon from '@atlaskit/icon/core/check-circle';
import MediaServicesPreselectedIcon from '@atlaskit/icon/glyph/media-services/preselected'

export function TaskPreview({
  task,
  group,
  onRemoveTask,
  onUpdateTask,
  onOpenQuickEdit,
  board,
}) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const { boardId } = useParams()
  const isDone = task?.status === 'done'

  const handleTaskClick = (ev) => {
    if (ev.target.closest('.task-edit-btn') || ev.target.closest('.task-delete-btn')) {
      return
    }

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
      status: isDone ? 'in-progress' : 'done',
      ...(isDone ? {} : { completedAt: new Date().toISOString() }),
    }

    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }

    onUpdateTask(updatedGroup)
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
      </div>
    </div>
  )
}
