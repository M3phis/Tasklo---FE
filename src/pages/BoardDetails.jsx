import { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  loadBoard,
  updateBoard,
  updateBoardOptimistic,
} from '../store/board.actions'
import { BoardHeader } from '../cmps/BoardHeader/BoardHeader'
import { GroupList } from '../cmps/GroupList'
import { BoardHeaderFilter, filterUtils, clearFilters } from '../cmps/BoardHeader/BoardHeaderFilter'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { Outlet } from 'react-router-dom'

export function BoardDetails() {
  const { boardId } = useParams()
  const dispatch = useDispatch()
  const board = useSelector((storeState) => storeState.boardModule.board)
  const [isLoading, setIsLoading] = useState(true)
  const [rsbIsOpen, setRsbIsOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filters = useSelector(state => state.boardModule.filters)

  useEffect(() => {
    loadBoard(boardId)
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.log('err', err)
        setIsLoading(false)
      })
  }, [boardId])

  function onDragEnd(result) {
    if (!result.destination) {
      return
    }

    const { groups } = board

    const startIdx = result.source.index
    const endIdx = result.destination.index

    if (result.type === 'group') {
      const [group] = groups.splice(startIdx, 1)
      groups.splice(endIdx, 0, group)
      updateBoardOptimistic({ ...board, groups })
    }

    if (result.type === 'task') {
      const groupStart = groups.find(
        (group) => group.id === result.source.droppableId
      )
      const groupEnd = groups.find(
        (group) => group.id === result.destination.droppableId
      )
      const [task] = groupStart.tasks.splice(startIdx, 1)
      groupEnd.tasks.splice(endIdx, 0, task)
      updateBoardOptimistic({ ...board, groups })
    }
  }

  let taskIsOpen = true

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
    )

    const updatedBoard = {
      ...board,
      groups: updatedGroups,
    }

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

  function handleBoardUpdate(updatedBoard) {
    updateBoardOptimistic(updatedBoard)
      .then(() => {
        if (updatedBoard.title !== board.title) {
          showSuccessMsg('Board title updated')
        }
        if (updatedBoard.isStarred !== board.isStarred) {
          showSuccessMsg(updatedBoard.isStarred ? 'Board starred' : 'Board unstarred')
        }
      })
      .catch((err) => {
        console.log('Error updating board:', err)
        showErrorMsg('Cannot update board')
      })
  }

  function handleClearAllFilters() {
    dispatch(clearFilters())
    showSuccessMsg('All filters cleared')
  }

  const filteredBoard = {
    ...board,
    groups: board?.groups?.map(group => ({
      ...group,
      tasks: filterUtils.filterTasks(group.tasks, filters, board)
    }))
  }

  if (isLoading) return <div>Loading...</div>
  if (!board) return <div>Board not found</div>

  return (
    <section className="board-details">
      <BoardHeader
        board={board}
        setFilterIsOpen={setIsFilterOpen}
        activeFilterCount={filterUtils.getActiveFilterCount(filters)}
        filteredTaskCount={filteredBoard?.groups?.reduce((total, group) => total + group.tasks.length, 0) || 0}
        setRsbIsOpen={setRsbIsOpen}
        onUpdateBoard={handleBoardUpdate}
        onClearAllFilters={handleClearAllFilters}
      />
      <div className="board-content">
        <div className="lists-container">
          <GroupList
            board={filteredBoard}
            boardId={boardId}
            onAddGroup={handleAddGroup}
            onUpdateList={handleUpdateList}
            onRemoveList={handleRemoveList}
            onUpdateTask={handleUpdateTask}
            onRemoveTask={handleRemoveTask}
            onDragEnd={onDragEnd}
          />
        </div>
      </div>

      <BoardHeaderFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <Outlet context={{ handleUpdateTask }} />
    </section>
  )
}
