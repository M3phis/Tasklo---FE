import { useState, useRef, useEffect } from 'react'
import { useClickAway } from 'react-use'
import { GroupListMenu } from './DynamicCmps/GroupListMenu'
import { TaskList } from './TaskList'
import { utilService } from '../services/util.service'
import { userService } from '../services/user'

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
  const menuTriggerRef = useRef(null)
  const formRef = useRef(null)
  const containerRef = useRef(null)

  useClickAway(formRef, () => {
    if (isAddingTask) {
      if (taskTitle.trim()) {
        const newTask = {
          id: Date.now().toString(),
          title: taskTitle,
          memberIds: [],
          labelIds: [],
          description: '',
          comments: [],
          attachments: [],
          checklists: [],
          createdAt: Date.now(),
          dueDate: null,
          status: 'in-progress',
          style: {},
        }

        const updatedGroup = {
          ...group,
          tasks: [...group.tasks, newTask],
        }

        onUpdateTask(updatedGroup).then(() => {
          setTaskTitle('')
          setIsAddingTask(false)
        })
      } else {
        setIsAddingTask(false)
        setTaskTitle('')
      }
    }
  })

  useEffect(() => {
    if (isAddingTask && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [isAddingTask])

  function handleAddTask(ev) {
    ev.preventDefault()
    if (!taskTitle.trim()) return

    const loggedInUser = userService.getLoggedinUser()

    const newTask = {
      id: utilService.makeId(),
      title: taskTitle,
      status: 'in-progress',
      description: '',
      comments: [],
      memberIds: [],
      labelIds: [],
      createdAt: Date.now(),
      dueDate: null,
      byMember: loggedInUser || {
        _id: 'guest',
        username: 'guest',
        fullname: 'Guest User',
        imgUrl:
          'https://cdn2.iconfinder.com/data/icons/audio-16/96/user_avatar_profile_login_button_account_member-1024.png',
      },
      style: {},
      groupId: group.id,
      attachments: [],
      checklists: [],
    }

    const updatedGroup = {
      ...group,
      tasks: [...group.tasks, newTask],
    }

    onUpdateTask(updatedGroup).then(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
      setTaskTitle('')
    })
  }

  function handleTitleClick(ev) {
    if (!isDragging) {
      setIsEditing(true)
    }
  }

  function handleTitleChange(ev) {
    setTitle(ev.target.value)
  }

  function handleTitleBlur() {
    setIsEditing(false)
    if (title !== group.title) {
      onUpdateList({ ...group, title })
    }
  }

  function handleKeyDown(ev) {
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

  function handleTaskKeyDown(ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault()
      handleAddTask(ev)
    } else if (ev.key === 'Escape') {
      setIsAddingTask(false)
      setTaskTitle('')
    }
  }

  function handleChangeColor(color) {
    const updatedGroup = {
      ...group,
      style: {
        ...(typeof group.style === 'object' ? group.style : {}),
        backgroundColor: color,
      },
    }
    onUpdateList(updatedGroup)
  }

  // Safe style handler to ensure style is always an object
  const safeStyle =
    typeof group.style === 'object' && group.style !== null ? group.style : {}

  return (
    <div className="group-preview" style={safeStyle}>
      <div className="group-header" style={safeStyle}>
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleKeyDown}
            onFocus={(e) => e.target.select()}
            autoFocus
            className={`group-title-editable ${isEditing ? 'editing' : ''}`}
          />
        ) : (
          <h3
            className="group-title-editable"
            onClick={handleTitleClick}
            style={safeStyle}
            onMouseDown={(ev) => {
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
          style={safeStyle}
        >
          <MoreIcon label="" primaryColor=" #626F86" />
        </button>
      </div>

      <div className="tasks-container" ref={containerRef}>
        <TaskList
          tasks={group.tasks}
          group={group}
          onRemoveTask={onRemoveTask}
          onUpdateTask={onUpdateTask}
          onOpenQuickEdit={onOpenQuickEdit}
          board={board}
        />

        <div className="add-task-section">
          {isAddingTask && (
            <form
              ref={formRef}
              onSubmit={handleAddTask}
              className="add-task-form"
              style={safeStyle}
            >
              <input
                type="text"
                value={taskTitle}
                onChange={(ev) => setTaskTitle(ev.target.value)}
                onKeyDown={handleTaskKeyDown}
                placeholder="Enter a title..."
                autoFocus
                className="task-input"
              />
              <div className="add-task-actions" style={safeStyle}>
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
                  <CrossIcon label="" primaryColor="#091E42" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="add-task-section">
        {!isAddingTask && (
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
