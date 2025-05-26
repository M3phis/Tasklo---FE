import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadBoard, updateBoard } from '../store/board.actions'
import { List } from '../cmps/List'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function BoardDetails() {
  const { boardId } = useParams()
  const board = useSelector((storeState) => storeState.boardModule.board)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingList, setIsAddingList] = useState(false)
  const [listTitle, setListTitle] = useState('')

  useEffect(() => {
    loadBoard(boardId)
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.log('err', err)
        setIsLoading(false)
      })
  }, [boardId])

  function handleAddList(ev) {
    ev.preventDefault()
    if (!listTitle.trim()) return

    const newList = {
      id: Date.now().toString(),
      title: listTitle,
      tasks: [],
    }

    const updatedBoard = {
      ...board,
      groups: [...board.groups, newList],
    }

    updateBoard(updatedBoard)
      .then(() => {
        showSuccessMsg('List added')
        setListTitle('')
        setIsAddingList(false)
      })
      .catch((err) => {
        console.log('err', err)
        showErrorMsg('Cannot add list')
      })
  }

  function handleUpdateList(updatedList) {
    const updatedGroups = board.groups.map((group) =>
      group.id === updatedList.id ? updatedList : group
    )

    const updatedBoard = {
      ...board,
      groups: updatedGroups,
    }

    updateBoard(updatedBoard)
      .then(() => showSuccessMsg('List updated'))
      .catch((err) => {
        console.log('err', err)
        showErrorMsg('Cannot update list')
      })
  }

  function handleRemoveList(listId) {
    const updatedGroups = board.groups.filter((group) => group.id !== listId)

    const updatedBoard = {
      ...board,
      groups: updatedGroups,
    }

    updateBoard(updatedBoard)
      .then(() => showSuccessMsg('List removed'))
      .catch((err) => {
        console.log('err', err)
        showErrorMsg('Cannot remove list')
      })
  }

  if (isLoading) return <div>Loading...</div>
  if (!board) return <div>Board not found</div>

  return (
    <section className="board-details">
      <div className="board-header">
        <h1>{board.title}</h1>
      </div>
      <div className="board-content">
        <div className="lists-container">
          {board.groups.map((list) => (
            <List
              key={list.id}
              list={list}
              onUpdateList={handleUpdateList}
              onRemoveList={handleRemoveList}
            />
          ))}
          {isAddingList ? (
            <form onSubmit={handleAddList} className="add-list">
              <input
                type="text"
                value={listTitle}
                onChange={(ev) => setListTitle(ev.target.value)}
                placeholder="Enter list title..."
                autoFocus
              />
              <div className="add-list-actions">
                <button type="submit" className="add-btn">
                  Add List
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsAddingList(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="add-list">
              <button
                className="add-list-btn"
                onClick={() => setIsAddingList(true)}
              >
                + Add a list
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
