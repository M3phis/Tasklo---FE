import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BoardList } from '../cmps/BoardList'
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred'
import { BoardFilter } from '../cmps/BoardFilter'
import {
  loadBoards,
  removeBoard,
  updateBoard,
  addBoard,
} from '../store/board.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { boardService } from '../services/board'
import { NavBarBoards } from '../cmps/NavBarBoards'
import { FaS } from 'react-icons/fa6'

export function BoardIndex() {
  const dispatch = useDispatch()
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const user = useSelector((storeState) => storeState.userModule.user)
  const [filterBy, setFilterBy] = useState(boardService.getEmptyFilter())

  // Robust null checks for user, user._id, board.createdBy, and board.members
  const userBoardFilter = (board) => {
    if (!user || !user._id) {
      // Guest: only show demo boards (createdBy is null or missing _id)
      return !board.createdBy || !board.createdBy._id;
    }
    // Logged-in: only show boards where user is owner or member
    const isOwner = board.createdBy && board.createdBy._id && (board.createdBy._id === user._id)
    const isMember = Array.isArray(board.members) && board.members.some(member => member && member._id && member._id === user._id)
    return isOwner || isMember
  }

  const starredBoards = boards.filter((board) => board.isStarred).filter(userBoardFilter)

  useEffect(() => {
    loadBoards()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty(
      '--dynamic-boardheader-background',
      'rgb(241, 242, 244)'
    )
    root.style.setProperty('--dynamic-appheader-background', 'white')
    root.style.setProperty('--dynamic-header-color', '#172b4d')
  })

  function onRemoveBoard(boardId) {
    removeBoard(boardId)
      .then(() => showSuccessMsg('Board removed'))
      .catch((err) => {
        console.log('err', err)
        showErrorMsg('Cannot remove board')
      })
  }

  function onEditBoard(board) {
    const title = prompt('New title?', board.title)
    if (title && title !== board.title) {
      updateBoard({ ...board, title })
        .then(() => showSuccessMsg('Board updated'))
        .catch((err) => {
          console.log('err', err)
          showErrorMsg('Cannot update board')
        })
    }
  }

  async function onAddBoard() {
    const board = boardService.getEmptyBoard()
    board.title = prompt('Board title?')
    if (!board.title) return

    try {
      const savedBoard = await addBoard(board)
      showSuccessMsg(`Board added (id: ${savedBoard._id})`)
    } catch (err) {
      console.log('err', err)
      showErrorMsg('Cannot add board')
    }
  }

  async function onToggleStarred(boardId) {
    const board = boards.find((board) => board._id === boardId)
    if (!board) return
    const updatedBoard = { ...board, isStarred: !board.isStarred }
    try {
      await updateBoard(updatedBoard)
      showSuccessMsg('Toggled star!')
    } catch {
      showErrorMsg('Failed to toggle star')
    }
  }

  function onSetFilter(filterBy) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }))
  }

  // Robust null checks for user, user._id, board.createdBy, and board.members
  const filteredBoards = boardService.getFilteredBoards(boards, filterBy).filter(userBoardFilter)

  return (
    <section className="board-index">
      <main className="boards-view">
        {starredBoards.length > 0 && (
          <section className="starred-board-list">
            <h3>
              <StarUnstarredIcon /> Starred Boards
            </h3>
            <BoardList
              boards={starredBoards}
              onRemoveBoard={onRemoveBoard}
              onUpdateBoard={onEditBoard}
              onToggleStarred={onToggleStarred}
              starBoards={true}
            />
          </section>
        )}

        <section className="board-index-container">
          <h3>YOUR WORKSPACES</h3>
          <div className="board-list-row">
            <NavBarBoards />
            <BoardList
              boards={filteredBoards}
              onRemoveBoard={onRemoveBoard}
              onEditBoard={onEditBoard}
              onToggleStarred={onToggleStarred}
              starBoards={false}
            />
          </div>
        </section>
      </main>
    </section>
  )
}
