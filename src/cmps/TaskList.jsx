import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router'

import { TaskPreview } from './TaskPreview'

export function TaskList({
  tasks = [],
  group,
  onRemoveTask,
  onUpdateTask,
  onOpenQuickEdit,
  board,
  isLabelsExtended,
  setIsLabelsExtended,
}) {
  const navigate = useNavigate()

  if (!group || !board) return null

  return (
    <Droppable droppableId={group.id} type="task" direction="vertical">
      {(provided) => (
        <ul
          className="task-list"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {tasks.map((task, idx) => (
            <Draggable key={task.id} draggableId={task.id} index={idx}>
              {(provided, snapshot) => (
                <li
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`task-list-item ${snapshot.isDragging && !snapshot.isDropAnimating
                    ? 'dragging'
                    : ''
                    }`}
                  style={
                    snapshot.isDragging && !snapshot.isDropAnimating
                      ? {
                        ...provided.draggableProps?.style,
                        opacity: 0.6,
                        transform: `${provided.draggableProps?.style?.transform} rotate(6deg)`,
                      }
                      : {
                        ...provided.draggableProps?.style,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }
                  }
                  onClick={() =>
                    navigate(`/board/${board._id}/${group.id}/${task.id}`)
                  }
                >
                  <TaskPreview
                    key={task.id}
                    task={task}
                    group={group}
                    onRemoveTask={onRemoveTask}
                    onUpdateTask={onUpdateTask}
                    onOpenQuickEdit={onOpenQuickEdit}
                    isEmptyPlaceholder={false}
                    board={board}
                    isLabelsExtended={isLabelsExtended}
                    setIsLabelsExtended={setIsLabelsExtended}
                  />
                </li>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  )
}
