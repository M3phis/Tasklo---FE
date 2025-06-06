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
  boardId,
  onUpdateList,
  onRemoveList,
  onUpdateTask,
  onRemoveTask,
  onOpenQuickEdit,
  board,
}) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [titleValue, setTitleValue] = useState(group.title)
  const [taskTitle, setTaskTitle] = useState('')
  const [isEditing, setIsEditing] = useState(false)
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
        {/* <div className="group-title"> */}
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
          className={`group-title-editable  ${isEditing ? 'editing' : ''}`}
          style={group.style}
        />
        {/* </div> */}
        {/* <button className="collapse-btn"> <EditorCollapseIcon label="" color="#9fadbc" /></button> */}
        <button
          ref={menuTriggerRef}
          className="options-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={group.style}
        >
          <MoreIcon label="" color="#172B4D" />
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
                <CrossIcon label="" color="#172B4D" />
              </button>
            </div>
          </form>
        ) : (
          <button
            className="add-task-btn"
            onClick={() => setIsAddingTask(true)}
          >
            <AddIcon label="" color="#9fadbc" /> Add a card{' '}
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
