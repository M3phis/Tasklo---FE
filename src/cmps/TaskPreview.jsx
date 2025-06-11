import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TaskQuickEdit } from './TaskQuickEdit'

import EditIcon from '@atlaskit/icon/core/edit'
import DeleteIcon from '@atlaskit/icon/core/delete'
import CheckCircleIcon from '@atlaskit/icon/core/check-circle'
import MediaServicesPreselectedIcon from '@atlaskit/icon/glyph/media-services/preselected'
import ClockIcon from '@atlaskit/icon/core/clock';
import TextLengthenIcon from '@atlaskit/icon-lab/core/text-lengthen';

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

  return (
    <>
      <div
        className={`task-preview ${isDone ? 'task-done' : ''}`}
        onClick={handleTaskClick}
        onMouseEnter={function () { setIsHovered(true) }}
        onMouseLeave={function () { setIsHovered(false) }}
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

          {task.labelIds && task.labelIds.length > 0 && (
            <div className="task-labels">
              {board.labels
                .filter(label => task.labelIds.includes(label.id))
                .map(label => (
                  <div
                    key={label.id}
                    className={`task-label ${label.color || 'gray'} ${!isLabelsExtended ? 'collapsed' : ''
                      }`}
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
              {task.date?.dueDate && (
                <div className={`task-badge date-badge ${getDateStatus()}`}>
                  <ClockIcon label="Due date" color="currentColor" />
                  <span>{formatDate()}</span>
                  {task.date?.isDone && <CheckCircleIcon label="Complete" color="currentColor" />}
                </div>
              )}

              {task.description && (
                <div className="task-badge">
                  <TextLengthenIcon label="TextLengthenIcon" color="currentColor" />
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




  // Helper functions
  function getDateStatus() {
    if (!task.date?.dueDate) return ''
    if (task.date.isDone) return 'done'

    const dueDate = new Date(task.date.dueDate)
    const now = new Date()
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    if (dueDate < now) return 'overdue'
    if (dueDate < oneDayFromNow) return 'due-soon'
    return ''
  }

  function formatDate() {
    if (!task.date?.dueDate) return null
    const date = new Date(task.date.dueDate)
    const now = new Date()

    if (date.getFullYear() !== now.getFullYear()) {
      return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`
    }
    return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`
  }
}