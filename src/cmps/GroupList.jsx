import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { GroupPreview } from './GroupPreview'

import AddIcon from '@atlaskit/icon/glyph/add'
import CrossIcon from '@atlaskit/icon/glyph/cross'


export function GroupList({
  board,
  boardId,
  onAddGroup,
  onUpdateList,
  onRemoveList,
  onUpdateTask,
  onRemoveTask,
  onDragEnd,
  socketService
}) {
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [groupTitle, setGroupTitle] = useState('')
  const [isLabelsExtended, setIsLabelsExtended] = useState(false)

  if (!board) {
    console.log('GroupList: board is null/undefined')
    return null
  }

  const { groups = [] } = board

  function handleAddGroup(ev) {
    ev.preventDefault()
    if (!groupTitle.trim()) {
      return
    }

    const newGroup = {
      id: Date.now().toString(),
      title: groupTitle,
      tasks: [],
      style: {},
    }

    onAddGroup(newGroup)
    setGroupTitle('')
    setIsAddingGroup(false)
  }

  function handleAddTask(groupId, taskData) {
    const updatedGroups = board.groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          tasks: [...group.tasks, taskData]
        }
      }
      return group
    })

    onUpdateTask(updatedGroups.find(g => g.id === groupId))

    socketService.addTask(boardId, groupId, taskData)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="groups" direction="horizontal" type="group">
        {(provided) => (
          <ul
            className="group-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {groups.map((group, idx) => (
              <Draggable key={group.id} draggableId={group.id} index={idx}>
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`group-list-item ${snapshot.isDragging && !snapshot.isDropAnimating
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
                  >
                    <GroupPreview
                      group={group}
                      board={board}
                      boardId={boardId}
                      socketService={socketService}
                      onUpdateList={onUpdateList}
                      onRemoveList={onRemoveList}
                      onUpdateTask={onUpdateTask}
                      onRemoveTask={onRemoveTask}
                      // onAddTask={handleAddTask}
                      isLabelsExtended={isLabelsExtended}
                      setIsLabelsExtended={setIsLabelsExtended}
                    />
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <li>
              <div className="group-list-item">
                {!isAddingGroup ? (
                  <button
                    className="add-group-btn"
                    onClick={() => setIsAddingGroup(true)}
                  >
                    <AddIcon label="" primaryColor="#42526E" /> Add another list
                  </button>
                ) : (
                  <form onSubmit={handleAddGroup} className="add-group-form">
                    <input
                      className="group-input"
                      type="text"
                      value={groupTitle}
                      onChange={(ev) => setGroupTitle(ev.target.value)}
                      placeholder="Enter list name..."
                      aria-label="List title"
                    />
                    <div className="add-group-actions">
                      <button
                        type="submit"
                        className="add-btn"
                        aria-label="Add new list"
                      >
                        Add list
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setIsAddingGroup(false)
                          setGroupTitle('')
                        }}
                      >
                        <CrossIcon label="" primaryColor="#091E42" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </li>
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )
}
