import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadBoard, updateBoard } from '../store/board.actions'
import { GroupList } from '../cmps/GroupList'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function BoardDetails() {
  const { boardId } = useParams()
  const board = useSelector((storeState) => storeState.boardModule.board)
  const [isLoading, setIsLoading] = useState(true)
  // const [isAddingList, setIsAddingList] = useState(false)
  // const [listTitle, setListTitle] = useState('')

  useEffect(() => {
    loadBoard(boardId)
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.log('err', err)
        setIsLoading(false)
      })
  }, [boardId])

  // function handleAddList(ev) {
  //   ev.preventDefault()
  //   if (!listTitle.trim()) return

  //   const newList = {
  //     id: Date.now().toString(),
  //     title: listTitle,
  //     tasks: [],
  //   }

  // const updatedBoard = {
  //   ...board,
  //   groups: [...board.groups, newList],
  // }

  //   updateBoard(updatedBoard)
  //     .then(() => {
  //       showSuccessMsg('List added')
  //       setListTitle('')
  //       setIsAddingList(false)
  //     })
  //     .catch((err) => {
  //       console.log('err', err)
  //       showErrorMsg('Cannot add list')
  //     })
  // }

  function handleAddGroup(newGroup) {
    const updatedBoard = {
      ...board,
      groups: [...board.groups, newGroup],
    }

    return updateBoard(updatedBoard)
      .then(() => showSuccessMsg('List added successfully'))
      .catch((err) => {
        console.error('Error adding list:', err)
        showErrorMsg('Failed to add list')
        throw err
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

  function handleUpdateTask(updatedGroup) {
    const updatedGroups = board.groups.map((group) =>
      group.id === updatedGroup.id ? updatedGroup : group
    );

    const updatedBoard = {
      ...board,
      groups: updatedGroups,
    };

    return updateBoard(updatedBoard)
      .then(() => showSuccessMsg('Task updated'))
      .catch((err) => {
        console.log('err', err)
        showErrorMsg('Cannot update task')
        throw err
      })
  }

  function handleRemoveTask(groupId, taskId) {
    const updatedGroups = board.groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          tasks: group.tasks.filter((task) => task.id !== taskId),
        }
      }
      return group
    })
    const updatedBoard = {
      ...board,
      groups: updatedGroups,
    }

    return updateBoard(updatedBoard)
      .then(() => showSuccessMsg('Task removed successfully'))
      .catch((err) => {
        console.log('Error removing task:', err)
        showErrorMsg('Cannot remove task')
        throw err
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
          <GroupList
            board={board}
            boardId={boardId}
            onAddGroup={handleAddGroup}
            onUpdateList={handleUpdateList}
            onRemoveList={handleRemoveList}
            onUpdateTask={handleUpdateTask}
            onRemoveTask={handleRemoveTask}
          />
        </div>
      </div>
    </section>
  )
}
