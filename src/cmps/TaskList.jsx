import { useState, useRef, useEffect } from 'react'
import { Card } from './Card'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export function TaskList({ tasks = [], group, onRemoveTask, onUpdateTask, boardId }) {
  const ref = useRef(null)
  const [isDraggedOver, setIsDraggedOver] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    return dropTargetForElements({
      element,
      getData() {
        return { groupId: group.id, type: 'group' }
      },
      onDragEnter() {
        setIsDraggedOver(true)
      },
      onDragLeave() {
        setIsDraggedOver(false)
      },
      onDrop() {
        setIsDraggedOver(false)
      },
      canDrop({ source }) {
        return source.data.groupId !== group.id
      }
    })
  }, [group.id])

  if (!tasks || tasks.length === 0) {
    return (
      <div 
        ref={ref}
        className={`task-list empty ${isDraggedOver ? 'drag-over' : ''}`}
      >
        <div className="empty-state">
          <p className="empty-message">No cards in this list</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={ref}
      className={`task-list ${isDraggedOver ? 'drag-over' : ''}`}
    >
      {tasks.map((task) => (
        <Card
          key={task.id}
          task={task}
          group={group}
          onRemoveTask={onRemoveTask}
          onUpdateTask={onUpdateTask}
          boardId={boardId}
        />
      ))}
    </div>
  )
}