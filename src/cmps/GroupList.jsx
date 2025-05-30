import { useState, useRef } from 'react'
import { GroupPreview } from './GroupPreview'
import AddIcon from '@atlaskit/icon/glyph/add'

export function GroupList({ board, onAddGroup, onUpdateList, onRemoveList, onUpdateTask, onRemoveTask }) {
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [groupTitle, setGroupTitle] = useState('')
  const { groups } = board

  function handleAddGroup(ev) {
    ev.preventDefault()
    if (!groupTitle.trim()) {
      showErrorMsg('List title cannot be empty')
      return
    }

    const newGroup = {
      id: Date.now().toString(),
      title: groupTitle,
      tasks: [],
      style: '',
    }

    onAddGroup(newGroup)
      .then(() => {
        setGroupTitle('')
        setIsAddingGroup(false)
      })
  }

  return (
    <ul className="group-list">
      {groups?.map((group) => (
        <li key={group.id} className="group-list-contant">
          <GroupPreview
            group={group}
            board={board}
            onUpdateList={onUpdateList}
            onRemoveList={onRemoveList}
            onUpdateTask={onUpdateTask}
            onRemoveTask={onRemoveTask}
          />
        </li>
      ))}
      <li>
        <div className="group-list-header">
          {!isAddingGroup ? (
            <button className="add-group-btn" onClick={() => setIsAddingGroup(true)} ><AddIcon label="" color="#9fadbc"/> Add another List</button>
          ) : (
            <form onSubmit={handleAddGroup} className="add-group-form">
              <input type="text" value={groupTitle} onChange={(ev) => setGroupTitle(ev.target.value)} placeholder="Enter list title..." autoFocus aria-label="List title" />
              <div className="add-group-actions">
                <button type="submit" className="add-btn" aria-label="Add new list">Add List</button>
                <button className="cancel-btn"
                  onClick={() => {
                    setIsAddingGroup(false)
                    setGroupTitle('')
                  }}
                >Cancel</button>
              </div>
            </form>
          )}
        </div>
      </li>
    </ul>
  )
}
