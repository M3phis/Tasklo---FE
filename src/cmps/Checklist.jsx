import { useState } from 'react'

export function Checklist({ checklist, onUpdateChecklist, onDeleteChecklist }) {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState('')

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

  return (
    <div className="checklist">
      <div className="checklist-header">
        <div className="checklist-title">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="checklist-icon"
          >
            <rect
              x="2"
              y="4"
              width="12"
              height="10"
              rx="2"
              stroke="#172b4d"
              strokeWidth="1.5"
            />
            <path
              d="M5 2v2M11 2v2"
              stroke="#172b4d"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M5.5 8.5l2 2 3-3"
              stroke="#172b4d"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{checklist.title}</span>
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
