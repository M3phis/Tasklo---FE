import { useState, useEffect, useRef } from 'react'

export function Checklist({ checklist, onUpdateChecklist, onDeleteChecklist }) {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(checklist.title)
  const [editingItemId, setEditingItemId] = useState(null)
  const [editedItemTitle, setEditedItemTitle] = useState('')
  const [showActionsForItem, setShowActionsForItem] = useState(null)
  const checklistRef = useRef(null)

  // Calculate progress
  const completedTodos = checklist.todos.filter((todo) => todo.isDone).length
  const totalTodos = checklist.todos.length
  const progressPercentage =
    totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0

  const handleToggleTodo = (todoId) => {
    const updatedTodos = checklist.todos.map((todo) =>
      todo.id === todoId ? { ...todo, isDone: !todo.isDone } : todo
    )
    const updatedChecklist = { ...checklist, todos: updatedTodos }
    onUpdateChecklist(updatedChecklist)
  }

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return

    const newTodo = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      isDone: false,
    }

    const updatedChecklist = {
      ...checklist,
      todos: [...checklist.todos, newTodo],
    }

    onUpdateChecklist(updatedChecklist)
    setNewItemTitle('')
    setIsAddingItem(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddItem()
    } else if (e.key === 'Escape') {
      setIsAddingItem(false)
      setNewItemTitle('')
    }
  }

  const handleTitleEdit = () => {
    if (!editedTitle.trim()) return

    const updatedChecklist = { ...checklist, title: editedTitle.trim() }
    onUpdateChecklist(updatedChecklist)
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleEdit()
    } else if (e.key === 'Escape') {
      setEditedTitle(checklist.title)
      setIsEditingTitle(false)
    }
  }

  const handleTitleBlur = () => {
    handleTitleEdit()
  }

  const handleDeleteItem = (todoId) => {
    const updatedTodos = checklist.todos.filter((todo) => todo.id !== todoId)
    const updatedChecklist = { ...checklist, todos: updatedTodos }
    onUpdateChecklist(updatedChecklist)
    setShowActionsForItem(null)
  }

  const handleEditItem = (todo) => {
    setEditingItemId(todo.id)
    setEditedItemTitle(todo.title)
    setShowActionsForItem(null)
  }

  const handleSaveItemEdit = () => {
    if (!editedItemTitle.trim()) return

    const updatedTodos = checklist.todos.map((todo) =>
      todo.id === editingItemId
        ? { ...todo, title: editedItemTitle.trim() }
        : todo
    )
    const updatedChecklist = { ...checklist, todos: updatedTodos }
    onUpdateChecklist(updatedChecklist)
    setEditingItemId(null)
    setEditedItemTitle('')
  }

  const handleCancelItemEdit = () => {
    setEditingItemId(null)
    setEditedItemTitle('')
  }

  const handleItemKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveItemEdit()
    } else if (e.key === 'Escape') {
      handleCancelItemEdit()
    }
  }

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        checklistRef.current &&
        !checklistRef.current.contains(event.target)
      ) {
        setShowActionsForItem(null)
      }
    }

    if (showActionsForItem) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showActionsForItem])

  return (
    <div className="checklist" ref={checklistRef}>
      <div className="checklist-header">
        <div className="checklist-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#5f6368"
            className="checklist-icon"
          >
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q8 0 15 1.5t14 4.5l-74 74H200v560h560v-266l80-80v346q0 33-23.5 56.5T760-120H200Zm261-160L235-506l56-56 170 170 367-367 57 55-424 424Z" />
          </svg>
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleBlur}
              className="checklist-title-input"
              autoFocus
            />
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              className="checklist-title-text"
            >
              {checklist.title}
            </span>
          )}
        </div>
        <button
          className="delete-checklist-btn"
          onClick={() => onDeleteChecklist(checklist.id)}
          title="Delete checklist"
        >
          Delete
        </button>
      </div>

      <div className="checklist-progress">
        <span className="progress-text">{progressPercentage}%</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="checklist-items">
        {checklist.todos.map((todo) => (
          <div key={todo.id} className="checklist-item">
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={() => handleToggleTodo(todo.id)}
              className="todo-checkbox"
            />
            {editingItemId === todo.id ? (
              <div className="item-edit-form">
                <input
                  type="text"
                  value={editedItemTitle}
                  onChange={(e) => setEditedItemTitle(e.target.value)}
                  onKeyDown={handleItemKeyDown}
                  className="item-edit-input"
                  autoFocus
                />
                <div className="item-edit-actions">
                  <button
                    className="save-item-btn"
                    onClick={handleSaveItemEdit}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-item-btn"
                    onClick={handleCancelItemEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span
                  className={`todo-title ${todo.isDone ? 'completed' : ''}`}
                  onClick={() => handleEditItem(todo)}
                >
                  {todo.title}
                </span>
                <div className="item-actions">
                  <button
                    className="item-menu-btn"
                    onClick={() =>
                      setShowActionsForItem(
                        showActionsForItem === todo.id ? null : todo.id
                      )
                    }
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="2.5" r="1.5" fill="#6b778c" />
                      <circle cx="8" cy="8" r="1.5" fill="#6b778c" />
                      <circle cx="8" cy="13.5" r="1.5" fill="#6b778c" />
                    </svg>
                  </button>
                  {showActionsForItem === todo.id && (
                    <div className="item-actions-menu">
                      <div className="menu-header">
                        <h3 className="menu-title">Item actions</h3>
                        <button
                          className="close-menu-btn"
                          onClick={() => setShowActionsForItem(null)}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M1 1L13 13M1 13L13 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="menu-content">
                        <button
                          className="item-action-btn"
                          onClick={() => handleDeleteItem(todo.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="add-item-section">
        {isAddingItem ? (
          <div className="add-item-form">
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add an item"
              className="add-item-input"
              autoFocus
            />
            <div className="add-item-actions">
              <button className="add-btn" onClick={handleAddItem}>
                Add
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setIsAddingItem(false)
                  setNewItemTitle('')
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="add-item-btn"
            onClick={() => setIsAddingItem(true)}
          >
            Add an item
          </button>
        )}
      </div>
    </div>
  )
}
