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
  const [filterBy, setFilterBy] = useState(boardService.getEmptyFilter())
  const starredBoards = boards.filter((board) => board.isStarred)

  useEffect(() => {
    loadBoards()
  }, [])

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

  const filteredBoards = boardService.getFilteredBoards(boards, filterBy)

  return (
    <section className="board-index">
      <aside className="home-sidebar">
        <div className="sidebar-section">
          <ul>
            <li>Boards</li>
            <li>Templates</li>
            <li>Home</li>
          </ul>
        </div>
      </aside>

      <main className="boards-view">
        <header className="boards-header">
          <div>
            <h2>Workspace</h2>
            <div className="workspace-type">Private</div>
          </div>
        </header>

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
