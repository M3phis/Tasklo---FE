import { useState } from 'react'

export function GroupPreview({ group, board, onUpdateList, onRemoveList, onUpdateTask, onRemoveTask }) {
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')

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

        onUpdateTask(updatedGroup)
            .then(() => {
                setTaskTitle('')
                setIsAddingTask(false)
            })
    }

    return (
        <div className="group-preview">
            <div className="group-header">
                <h3>{group.title}</h3>
                <button className="remove-group-btn" onClick={() => onRemoveList(group.id)} aria-label="Remove group">×</button>
            </div>

            <div className="task-list">
                {group.tasks.map(task => (
                    <div key={task.id} className="task-card">
                        <p>{task.title}</p>
                        <button className="remove-task-btn" onClick={() => onRemoveTask(group.id, task.id)} aria-label="Remove task" >X</button>
                    </div>
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
                            <button type="submit" className="add-btn">Add Card</button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setIsAddingTask(false)
                                    setTaskTitle('')
                                }}
                            > Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <button className="add-task-btn" onClick={() => setIsAddingTask(true)}>
                        + Add a card
                    </button>
                )}
            </div>
        </div>
    )
}