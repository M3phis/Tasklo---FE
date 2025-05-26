import { useState } from 'react'

export function List({ list, onUpdateList, onRemoveList }) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!taskTitle.trim()) return

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: null,
      memberIds: [],
      labelIds: [],
      checklists: [],
      style: {},
    }

    const updatedList = {
      ...list,
      tasks: [...list.tasks, newTask],
    }

    onUpdateList(updatedList)
    setTaskTitle('')
    setIsAddingTask(false)
  }

  return (
    <div className="list">
      <div className="list-header">
        <h3>{list.title}</h3>
        <button
          className="remove-list-btn"
          onClick={() => onRemoveList(list.id)}
        >
          ×
        </button>
      </div>
      <div className="list-content">
        {list.tasks.map((task) => (
          <div key={task.id} className="task-card">
            <p>{task.title}</p>
          </div>
        ))}
        {isAddingTask ? (
          <form onSubmit={handleSubmit} className="add-task-form">
            <input
              type="text"
              value={taskTitle}
              onChange={(ev) => setTaskTitle(ev.target.value)}
              placeholder="Enter a title for this card..."
              autoFocus
            />
            <div className="add-task-actions">
              <button type="submit" className="add-btn">
                Add Card
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsAddingTask(false)}
              >
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
