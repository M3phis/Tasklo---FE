
import { TaskPreview } from './TaskPreview'

export function TaskList({
  tasks = [],
  group,
  onRemoveTask,
  onUpdateTask,
  onOpenQuickEdit
}) {

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskPreview
          key={task.id}
          task={task}
          group={group}
          onRemoveTask={onRemoveTask}
          onUpdateTask={onUpdateTask}
          onOpenQuickEdit={onOpenQuickEdit}
          isEmptyPlaceholder={false}
        />
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
    </div>
  )
}