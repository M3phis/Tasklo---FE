import { useState, useRef, useEffect } from 'react'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export function Card({ task, onRemoveTask, group }) {
  const [isDragging, setIsDragging] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    return draggable({
      element,
      onDragStart(event) {
        setIsDragging(true)
        console.log(event)
        document.body.classList.add('dragging')
      },
      onDragOver(event) {
        event.preventDefault()
      },

      onDrop() {
        setIsDragging(false)
        document.body.classList.remove('dragging')
      },
    })
  }, [])
  return (
    <div
      key={task.id}
      className={`task-card ${isDragging ? 'drag-cursor' : ''}`}
      ref={ref}
    >
      <p>{task.title}</p>
      <button
        className="remove-task-btn"
        onClick={() => onRemoveTask(group.id, task.id)}
        aria-label="Remove task"
      >
        X
      </button>
    </div>
  )
}
