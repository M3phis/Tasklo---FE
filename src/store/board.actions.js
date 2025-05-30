import { boardService } from '../services/board'
import { store } from '../store/store'
import { ADD_BOARD, REMOVE_BOARD, SET_BOARDS, SET_BOARD, UPDATE_BOARD, ADD_BOARD_ACTIVITY, MOVE_CARD } from './board.reducer'

export async function loadBoards(filterBy) {
    try {
        const boards = await boardService.query(filterBy)
        store.dispatch(getCmdSetBoards(boards))
    } catch (err) {
        console.log('Cannot load boards', err)
        throw err
    }
}

export async function loadBoard(boardId) {
    try {
        const board = await boardService.getById(boardId)
        store.dispatch(getCmdSetBoard(board))
        return board
    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }
}

export async function addBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch(getCmdAddBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot add board', err)
        throw err
    }
}

export async function updateBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch(getCmdUpdateBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot update board', err)
        throw err
    }
}

export async function removeBoard(boardId) {
    try {
        await boardService.remove(boardId)
        store.dispatch(getCmdRemoveBoard(boardId))
    } catch (err) {
        console.log('Cannot remove board', err)
        throw err
    }
}

export async function addBoardActivity(boardId, activity) {
    try {
        const savedActivity = await boardService.addActivity(boardId, activity)
        store.dispatch(getCmdAddBoardActivity(savedActivity))
        return savedActivity
    } catch (err) {
        console.log('Cannot add activity', err)
        throw err
    }
}


export async function moveCard(boardId, sourceGroupId, taskId, targetGroupId) {
    try {
        // Optimistically update the UI
        const board = store.getState().boardModule.board
        const sourceGroup = board.groups.find(g => g.id === sourceGroupId)
        const targetGroup = board.groups.find(g => g.id === targetGroupId)
        const task = sourceGroup.tasks.find(t => t.id === taskId)

        // Create optimistic update
        const optimisticBoard = {
            ...board,
            groups: board.groups.map(group => {
                if (group.id === sourceGroupId) {
                    return {
                        ...group,
                        tasks: group.tasks.filter(t => t.id !== taskId)
                    }
                }
                if (group.id === targetGroupId) {
                    return {
                        ...group,
                        tasks: [...group.tasks, task]
                    }
                }
                return group
            })
        }

        // Update UI immediately
        store.dispatch({
            type: MOVE_CARD,
            board: optimisticBoard
        })

        // Then update server in background
        const savedBoard = await boardService.moveCard(boardId, sourceGroupId, taskId, targetGroupId)
        store.dispatch(getCmdUpdateBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot move card', err)
        // If server update fails, reload the board to sync with server state
        loadBoard(boardId)
        throw err
    }
}




// Command Creators:
function getCmdSetBoards(boards) {
    return {
        type: SET_BOARDS,
        boards
    }
}

function getCmdSetBoard(board) {
    return {
        type: SET_BOARD,
        board
    }
}

function getCmdRemoveBoard(boardId) {
    return {
        type: REMOVE_BOARD,
        boardId
    }
}

function getCmdAddBoard(board) {
    return {
        type: ADD_BOARD,
        board
    }
}

function getCmdUpdateBoard(board) {
    return {
        type: UPDATE_BOARD,
        board
    }
}

function getCmdAddBoardActivity(activity) {
    return {
        type: ADD_BOARD_ACTIVITY,
        activity
    }
}

function getCmdMoveTask({ startGroupId, finishGroupId, startIndex, finishIndex }) {
    return {
        type: MOVE_TASK,
        payload: { startGroupId, finishGroupId, startIndex, finishIndex }
    }
}

function getCmdMoveCard(boardId, sourceGroupId, taskId, targetGroupId) {
    return {
        type: MOVE_CARD,
        payload: { boardId, sourceGroupId, taskId, targetGroupId }
    }
} 