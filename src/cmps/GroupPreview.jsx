import { useState, useRef } from 'react'
import ContentEditable from 'react-contenteditable'
import { Card } from './Card'

export function GroupPreview({
  group,
  onUpdateList,
  onRemoveList,
  onUpdateTask,
  onRemoveTask,
}) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [titleValue, setTitleValue] = useState(group.title)
  const [taskTitle, setTaskTitle] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const contentEditableRef = useRef(null)

  function handleAddTask(ev) {
    ev.preventDefault()
    if (!taskTitle.trim()) return

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
    }

    const updatedGroup = {
      ...group,
      tasks: [...group.tasks, newTask],
    }

    onUpdateTask(updatedGroup).then(() => {
      setTaskTitle('')
      setIsAddingTask(false)
    })
  }

  function saveTitle() {
    if (!titleValue.trim()) {
      setTitleValue(group.title)
      return
    }

    const updatedGroup = {
      ...group,
      title: titleValue.trim(),
    }

    onUpdateList(updatedGroup).catch(() => {
      setTitleValue(group.title)
    })
  }

  function handleFocus() {
    setIsEditing(true)

    // Select all text when clicking (exact Trello behavior)
    setTimeout(() => {
      if (contentEditableRef.current) {
        const range = document.createRange()
        range.selectNodeContents(contentEditableRef.current)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }, 0)
  }

  function handleBlur() {
    setIsEditing(false)
    if (titleValue !== group.title) {
      saveTitle()
    }
  }

  function handleChange(evt) {
    setTitleValue(evt.target.value)
  }

  function handleKeyDown(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault()
      contentEditableRef.current?.blur()
    }
    if (evt.key === 'Escape') {
      evt.preventDefault()
      setTitleValue(group.title)
      contentEditableRef.current?.blur()
    }
  }

  return (
    <div className="group-preview">
      <div className="group-header">
        <div className="group-title">
          <ContentEditable
            innerRef={contentEditableRef}
            html={titleValue}
            disabled={false}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            tagName="h3"
            suppressContentEditableWarning={true}
            style={{
              cursor: 'pointer',
              margin: 0,
              padding: isEditing ? '4px 8px' : '6px 8px',
              borderRadius: '3px',
              outline: 'none',
              fontSize: '14px',
              fontWeight: '600',
              lineHeight: '20px',
              minHeight: '28px',
              display: 'inline-block',
              minWidth: '120px',
              maxWidth: '300px',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              backgroundColor: isEditing ? 'white' : 'transparent',
              color: isEditing ? '#black' : '#172b4d',
              border: isEditing ? '2px solid #026aa7' : '2px solid transparent',
              boxShadow: isEditing
                ? '0 0 0 2px rgba(38, 132, 255, 0.2)'
                : 'none',
              transition: 'all 0.1s ease-in-out',
            }}
            onMouseEnter={(e) => {
              if (!isEditing) {
                e.target.style.backgroundColor = 'rgba(9, 30, 66, 0.04)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isEditing) {
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          />
        </div>
        <button className="collapse-btn">collapse</button>
        <button className="options-btn">***</button>
      </div>

      <div className="task-list">
        {group.tasks.map((task) => (
          <Card
            group={group}
            key={task.id}
            task={task}
            onRemoveTask={onRemoveTask}
          />
        ))}
      </div>

      <div className="add-task-section">
        {isAddingTask ? (
          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              value={taskTitle}
              onChange={(ev) => setTaskTitle(ev.target.value)}
              placeholder="Enter a title for this card..."
              autoFocus
              aria-label="Task title"
            />
            <div className="add-task-actions">
              <button type="submit" className="add-btn">
                Add Card
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setIsAddingTask(false)
                  setTaskTitle('')
                }}
              >
                {' '}
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            className="add-task-btn"
            onClick={() => setIsAddingTask(true)}
          >
            + Add a card
          </button>
        )}
      </div>
    </div>
  )
}
