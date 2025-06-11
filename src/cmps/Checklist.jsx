import { useState } from 'react'

export function Checklist({ checklist, onUpdateChecklist, onDeleteChecklist }) {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(checklist.title)

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

  return (
    <div className="checklist">
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
            <span className={`todo-title ${todo.isDone ? 'completed' : ''}`}>
              {todo.title}
            </span>
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
