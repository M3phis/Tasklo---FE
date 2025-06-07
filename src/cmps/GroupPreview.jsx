import { useState, useRef } from 'react'
import ContentEditable from 'react-contenteditable'
import { GroupListMenu } from './DynamicCmps.jsx/GroupListMenu'
import { TaskList } from './TaskList'

import EditorCollapseIcon from '@atlaskit/icon/glyph/editor/collapse'
import AddIcon from '@atlaskit/icon/glyph/add'
import MoreIcon from '@atlaskit/icon/glyph/more'
import CrossIcon from '@atlaskit/icon/glyph/cross'

export function GroupPreview({
  group,
  board,
  boardId,
  onUpdateList,
  onRemoveList,
  onUpdateTask,
  onRemoveTask,
  onOpenQuickEdit,
}) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [title, setTitle] = useState(group.title)
  const [taskTitle, setTaskTitle] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const contentEditableRef = useRef(null)
  const menuTriggerRef = useRef(null)

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

  const handleTitleClick = (ev) => {
    if (!isDragging) {
      setIsEditing(true)
    }
  }

  const handleTitleChange = (ev) => {
    setTitle(ev.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    if (title !== group.title) {
      onUpdateList({ ...group, title })
    }
  }

  const handleKeyDown = (ev) => {
    if (ev.key === 'Enter') {
      setIsEditing(false)
      if (title !== group.title) {
        onUpdateList({ ...group, title })
      }
    } else if (ev.key === 'Escape') {
      setIsEditing(false)
      setTitle(group.title)
    }
  }

  function handleChangeColor(color) {
    const updatedGroup = {
      ...group,
      style: {
        ...group.style,
        backgroundColor: color,
      },
    }
    onUpdateList(updatedGroup)
  }

  return (
    <div className="group-preview">
      <div className="group-header" style={group.style}>
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="group-title-input"
          />
        ) : (
          <h3
            className="group-title"
            onClick={handleTitleClick}
            onMouseDown={(ev) => {
              // Only set dragging if it's not a click (check if mouse moves)
              const startX = ev.clientX
              const startY = ev.clientY

              const handleMouseMove = (moveEv) => {
                const deltaX = Math.abs(moveEv.clientX - startX)
                const deltaY = Math.abs(moveEv.clientY - startY)
                if (deltaX > 5 || deltaY > 5) {
                  setIsDragging(true)
                }
              }

              const handleMouseUp = () => {
                setIsDragging(false)
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }

              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
          >
            {group.title}
          </h3>
        )}
        <button
          ref={menuTriggerRef}
          className="options-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={group.style}
        >
          <MoreIcon label="" primaryColor=" #626F86" />
        </button>
      </div>

      <TaskList
        tasks={group.tasks}
        group={group}
        onRemoveTask={onRemoveTask}
        onUpdateTask={onUpdateTask}
        onOpenQuickEdit={onOpenQuickEdit}
        board={board}
      />

      <div className="add-task-section">
        {isAddingTask ? (
          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              value={taskTitle}
              onChange={(ev) => setTaskTitle(ev.target.value)}
              placeholder="Enter a title..."
              autoFocus
              className="task-input"
            />
            <div className="add-task-actions">
              <button type="submit" className="add-btn">
                {' '}
                Add card{' '}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setIsAddingTask(false)
                  setTaskTitle('')
                }}
              >
                <CrossIcon label="" primaryColor='#091E42' />
              </button>
            </div>
          </form>
        ) : (
          <button
            className="add-task-btn"
            onClick={() => setIsAddingTask(true)}
          >
            <AddIcon label="" primaryColor="#172B4D" /> Add a card{' '}
          </button>
        )}
      </div>

      <GroupListMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onAddCard={() => setIsAddingTask(true)}
        onDeleteList={() => onRemoveList(group.id)}
        onChangeColor={handleChangeColor}
        currentColor={group.style?.backgroundColor}
        triggerRef={menuTriggerRef}
      />
    </div>
  )
}
