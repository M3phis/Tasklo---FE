import { useState, useRef } from 'react'
import { GroupPreview } from './GroupPreview'

import AddIcon from '@atlaskit/icon/glyph/add'
import CrossIcon from '@atlaskit/icon/glyph/cross'

export function GroupList({ board, boardId, onAddGroup, onUpdateList, onRemoveList, onUpdateTask, onRemoveTask }) {
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
        <li key={group.id} className="group-list-content">
          <GroupPreview
            group={group}
            board={board}
            boardId={boardId}
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
            <button className="add-group-btn" onClick={() => setIsAddingGroup(true)} ><AddIcon label="" color="#9fadbc" /> Add another list</button>
          ) : (
            <form onSubmit={handleAddGroup} className="add-group-form">
              <input className='group-input' type="text" value={groupTitle} onChange={(ev) => setGroupTitle(ev.target.value)} placeholder="Enter list name..." aria-label="List title" />
              <div className="add-group-actions">
                <button type="submit" className="add-btn" aria-label="Add new list">Add list</button>
                <button className="cancel-btn"
                  onClick={() => {
                    setIsAddingGroup(false)
                    setGroupTitle('')
                  }}
                ><CrossIcon label="" color="#172B4D" /></button>
              </div>
            </form>
          )}
        </div>
      </li>
    </ul>
  )
}
