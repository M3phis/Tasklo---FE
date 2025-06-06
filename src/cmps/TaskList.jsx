import { Droppable, Draggable } from 'react-beautiful-dnd'
import { TaskPreview } from './TaskPreview'
import { useNavigate } from 'react-router'

export function TaskList({
  tasks = [],
  group,
  onRemoveTask,
  onUpdateTask,
  onOpenQuickEdit,
  board,
}) {
  const navigate = useNavigate()

  return (
    <Droppable droppableId={group.id} type="task" direction="vertical">
      {(provided) => (
        <ul
          className="task-list clean-list"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {tasks.map((task, idx) => (
            <Draggable key={task.id} draggableId={task.id} index={idx}>
              {(provided, snapshot) => (
                <li
                  key={task.id}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  isDragging={snapshot.isDragging && !snapshot.isDropAnimating}
                  style={
                    snapshot.isDragging && !snapshot.isDropAnimating
                      ? {
                          ...provided.draggableProps?.style,
                          opacity: 0.6,
                          rotate: '6deg',
                        }
                      : {
                          ...provided.draggableProps?.style,
                          cursor: 'pointer',
                          transitionDuration: '0.2s',
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
                  />
                </li>
              )}
            </Draggable>
          ))}

          {tasks.length === 0 && (
            <TaskPreview
              key={`empty-${group.id}`}
              task={null}
              group={group}
              onRemoveTask={onRemoveTask}
              onUpdateTask={onUpdateTask}
              onOpenQuickEdit={onOpenQuickEdit}
              isEmptyPlaceholder={true}
            />
          )}

          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  )
}
