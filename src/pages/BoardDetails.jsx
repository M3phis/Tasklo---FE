import chroma from 'chroma-js'
import ColorThief from 'colorthief'
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
import {
  BoardHeaderFilter,
  filterUtils,
  clearFilters,
} from '../cmps/BoardHeader/BoardHeaderFilter'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { Outlet } from 'react-router-dom'
import { store } from '../store/store'
import {
  socketService,
  SOCKET_EVENT_GROUP_ADDED,
  SOCKET_EVENT_GROUP_UPDATED,
  SOCKET_EVENT_GROUP_DELETED,
  SOCKET_EVENT_TASK_ADDED,
  SOCKET_EVENT_TASK_UPDATED,
  SOCKET_EVENT_TASK_DELETED,
  SOCKET_EVENT_TASK_MOVED,
  SOCKET_EVENT_BOARD_UPDATED
} from '../services/socket.service'

export function BoardDetails() {
  const { boardId } = useParams()
  const dispatch = useDispatch()
  const board = useSelector((storeState) => storeState.boardModule.board)
  const [isLoading, setIsLoading] = useState(true)
  const [rsbIsOpen, setRsbIsOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filters = useSelector((state) => state.boardModule.filters)

  useEffect(() => {
    loadBoard(boardId)
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.log('err', err)
        setIsLoading(false)
      })
  }, [boardId])

  useEffect(() => {
    if (!boardId) return

    console.log('🔌 Setting up socket listeners for board:', boardId)

    socketService.watchBoard(boardId)

    const handleGroupAdded = (data) => {
      if (data.boardId === boardId) {
        showSuccessMsg(`New group "${data.title}" was added!`)
        store.dispatch({
          type: 'ADD_GROUP_SOCKET',
          group: {
            id: data.id || `g${Date.now()}`,
            title: data.title || 'New Group',
            tasks: data.tasks || [],
            ...data,
          },
        })
      }
    }

    const handleGroupUpdated = (data) => {
      if (data.boardId === boardId) {
        showSuccessMsg(`Group "${data.title}" was updated!`)
        store.dispatch({
          type: 'UPDATE_GROUP_SOCKET',
          group: data,
        })
      }
    }

    const handleGroupDeleted = (data) => {
      if (data.boardId === boardId) {
        showSuccessMsg('Group was deleted!')
        store.dispatch({
          type: 'REMOVE_GROUP_SOCKET',
          groupId: data.groupId,
        })
      }
    }

    const handleTaskAdded = (data) => {
      if (data.boardId === boardId) {
        showSuccessMsg(`New task "${data.title}" was added!`)
        store.dispatch({
          type: 'ADD_TASK_SOCKET',
          groupId: data.groupId,
          task: {
            id: data.id || `c${Date.now()}`,
            title: data.title || 'New Task',
            ...data,
          },
        })
      }
    }

    const handleTaskUpdated = (data) => {
      if (data.boardId === boardId) {
        showSuccessMsg(`Task was updated!`)
        store.dispatch({
          type: 'UPDATE_TASK_SOCKET',
          taskId: data.taskId,
          updates: data,
        })
      }
    }

    const handleTaskDeleted = (data) => {
      if (data.boardId === boardId) {
        showSuccessMsg('Task was deleted!')
        store.dispatch({
          type: 'REMOVE_TASK_SOCKET',
          groupId: data.groupId,
          taskId: data.taskId,
        })
      }
    }

    const handleTaskMoved = (data) => {
      if (data.boardId === boardId) {
        showSuccessMsg('A task was moved!')
        store.dispatch({
          type: 'MOVE_TASK_SOCKET',
          taskId: data.taskId,
          sourceGroupId: data.sourceGroupId,
          targetGroupId: data.targetGroupId,
        })
      }
    }

    const handleBoardUpdated = (data) => {
      if (data.boardId === boardId) {
        showSuccessMsg('Board was updated by another user!')
        store.dispatch({
          type: 'UPDATE_BOARD_SOCKET',
          boardId: data.boardId,
          updates: data.updates,
        })
      }
    }

    socketService.on(SOCKET_EVENT_GROUP_ADDED, handleGroupAdded)
    socketService.on(SOCKET_EVENT_GROUP_UPDATED, handleGroupUpdated)
    socketService.on(SOCKET_EVENT_GROUP_DELETED, handleGroupDeleted)

    socketService.on(SOCKET_EVENT_TASK_ADDED, handleTaskAdded)
    socketService.on(SOCKET_EVENT_TASK_UPDATED, handleTaskUpdated)
    socketService.on(SOCKET_EVENT_TASK_DELETED, handleTaskDeleted)
    socketService.on(SOCKET_EVENT_TASK_MOVED, handleTaskMoved)

    socketService.on(SOCKET_EVENT_BOARD_UPDATED, handleBoardUpdated)

    return () => {
      console.log('🔌 Cleaning up socket listeners for board:', boardId)
      socketService.unwatchBoard(boardId)
      socketService.off(SOCKET_EVENT_GROUP_ADDED, handleGroupAdded)
      socketService.off(SOCKET_EVENT_GROUP_UPDATED, handleGroupUpdated)
      socketService.off(SOCKET_EVENT_GROUP_DELETED, handleGroupDeleted)

      socketService.off(SOCKET_EVENT_TASK_ADDED, handleTaskAdded)
      socketService.off(SOCKET_EVENT_TASK_UPDATED, handleTaskUpdated)
      socketService.off(SOCKET_EVENT_TASK_DELETED, handleTaskDeleted)
      socketService.off(SOCKET_EVENT_TASK_MOVED, handleTaskMoved)

      socketService.off(SOCKET_EVENT_BOARD_UPDATED, handleBoardUpdated)
    }
  }, [boardId])

  useEffect(() => {
    if (!board) return

    const root = document.documentElement

    if (board.style.background) {
      root.style.setProperty(
        '--dynamic-board-background',
        `url(${board.style.background})`
      )
      extractColorsFromImage(board.style.background)
      root.style.setProperty('--dynamic-board-background-color', 'none')
    } else if (board.style.color) {
      root.style.setProperty(
        '--dynamic-board-background-color',
        `${board.style.color}`
      )
      root.style.setProperty('--dynamic-board-background', 'none')

      const baseColor = chroma(board.style.color)
      const color1 = baseColor.brighten(0.5).hex()
      const color2 = baseColor.darken(1).hex()
      const textColor =
        chroma.contrast(baseColor, 'white') > 4.5 ? 'white' : 'black'

      root.style.setProperty('--dynamic-boardheader-background', color1)
      root.style.setProperty('--dynamic-appheader-background', color2)
      root.style.setProperty(' --dynamic-header-color', textColor)
    }
  }, [])

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
      socketService.moveTask(boardId, task.id, result.source.droppableId, result.destination.droppableId)
    }
  }

  let taskIsOpen = true

  function handleAddGroup(newGroup) {
    const updatedBoard = {
      ...board,
      groups: [...board.groups, newGroup],
    }

    socketService.addGroup(boardId, newGroup)

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

    socketService.updateGroup(boardId, updatedList.id, updatedList)

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

    socketService.deleteGroup(boardId, listId)

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

    const oldGroup = board.groups.find(g => g.id === updatedGroup.id)
    const updatedTasks = updatedGroup.tasks.filter(task => {
      const oldTask = oldGroup?.tasks.find(t => t.id === task.id)
      return !oldTask || JSON.stringify(oldTask) !== JSON.stringify(task)
    })

    updatedTasks.forEach(task => {
      socketService.updateTask(boardId, task.id, {
        ...task,
        groupId: updatedGroup.id,
      })
    })

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

    socketService.deleteTask(boardId, taskId, groupId)

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
          showSuccessMsg(
            updatedBoard.isStarred ? 'Board starred' : 'Board unstarred'
          )
        }
      })
      .catch((err) => {
        console.log('Error updating board:', err)
        showErrorMsg('Cannot update board')
      })


  }

  async function extractColorsFromImage(imgUrl) {
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = imgUrl

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      const colorThief = new ColorThief()
      const rgb = colorThief.getColor(img)
      if (!rgb) throw new Error('No color extracted from image')

      const baseColor = chroma.rgb(rgb).hex()
      const color1 = chroma(baseColor).brighten(0.5).hex()
      const color2 = chroma(baseColor).darken(1).hex()
      const textColor =
        chroma.contrast(baseColor, 'white') > 4.5 ? 'white' : 'black'

      const root = document.documentElement
      root.style.setProperty('--dynamic-boardheader-background', color1)
      root.style.setProperty('--dynamic-appheader-background', color2)
      root.style.setProperty('--dynamic-header-color', textColor)
    } catch (err) {
      console.error('Error extracting colors from image:', err)
    }
  }

  function handleClearAllFilters() {
    dispatch(clearFilters())
    showSuccessMsg('All filters cleared')
  }

  const filteredBoard = {
    ...board,
    groups: board?.groups?.map((group) => ({
      ...group,
      tasks: filterUtils.filterTasks(group.tasks, filters, board),
    })),
  }

  if (isLoading) return <div>Loading...</div>
  if (!board) return <div>Board not found</div>

  return (
    <section className="board-details">
      <BoardHeader
        board={board}
        setFilterIsOpen={setIsFilterOpen}
        activeFilterCount={filterUtils.getActiveFilterCount(filters)}
        filteredTaskCount={
          filteredBoard?.groups?.reduce(
            (total, group) => total + group.tasks.length,
            0
          ) || 0
        }
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
            socketService={socketService}
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
