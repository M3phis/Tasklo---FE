import { boardService } from '../services/board'
import { filterReducer } from '../cmps/BoardHeader/BoardHeaderFilter'

// Action Types
export const SET_BOARDS = 'SET_BOARDS'
export const SET_BOARD = 'SET_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const ADD_BOARD_ACTIVITY = 'ADD_BOARD_ACTIVITY'
export const MOVE_CARD = 'MOVE_CARD'
export const SET_FILTER = 'SET_FILTER'
export const CLEAR_FILTERS = 'CLEAR_FILTERS'
export const ADD_GROUP_SOCKET = 'ADD_GROUP_SOCKET'
export const ADD_TASK_SOCKET = 'ADD_TASK_SOCKET'
export const UPDATE_TASK_SOCKET = 'UPDATE_TASK_SOCKET'
export const MOVE_TASK_SOCKET = 'MOVE_TASK_SOCKET'
export const UPDATE_BOARD_SOCKET = 'UPDATE_BOARD_SOCKET'
export const UPDATE_GROUP_SOCKET = 'UPDATE_GROUP_SOCKET'
export const REMOVE_GROUP_SOCKET = 'REMOVE_GROUP_SOCKET'
export const REMOVE_TASK_SOCKET = 'REMOVE_TASK_SOCKET'


const initialState = {
    boards: [],
    board: null,
    filters: filterReducer(undefined, {}),
    filterBy: boardService.getEmptyFilter(),
}



export function boardReducer(state = initialState, action) {
    let boards
    let board

    switch (action.type) {
        case SET_BOARDS:
            return { ...state, boards: action.boards }

        case SET_BOARD:
            return { ...state, board: action.board }

        case REMOVE_BOARD:
            boards = state.boards.filter((board) => board._id !== action.boardId)
            return { ...state, boards }

        case ADD_BOARD:
            boards = [...state.boards, action.board]
            return { ...state, boards }

        case UPDATE_BOARD:
            boards = state.boards.map((board) =>
                board._id === action.board._id ? action.board : board
            )
            board = state.board?._id === action.board._id ? action.board : state.board
            return { ...state, boards, board }

        case ADD_BOARD_ACTIVITY:
            board = {
                ...state.board,
                activities: [...state.board.activities, action.activity],
            }
            return { ...state, board }

        case MOVE_CARD:
            return { ...state, board: action.board }

        case SET_FILTER:
            return {
                ...state,
                filters: { ...state.filters, ...action.filters }
            }

        case CLEAR_FILTERS:
            return {
                ...state,
                filters: filterReducer(undefined, {})
            }

        case ADD_GROUP_SOCKET:
            board = {
                ...state.board,
                groups: [...(state.board.groups || []), action.group]
            }
            return { ...state, board }

        case ADD_TASK_SOCKET:
            board = {
                ...state.board,
                groups: (state.board.groups || []).map(group =>
                    group.id === action.groupId
                        ? { ...group, tasks: [...(group.tasks || []), action.task] }
                        : group
                )
            }
            return { ...state, board }

        case UPDATE_TASK_SOCKET:
            board = {
                ...state.board,
                groups: (state.board.groups || []).map(group => ({
                    ...group,
                    tasks: (group.tasks || []).map(task =>
                        task.id === action.taskId
                            ? { ...task, ...action.updates }
                            : task
                    )
                }))
            }
            return { ...state, board }

        case MOVE_TASK_SOCKET:
            const { sourceGroupId, targetGroupId, taskId } = action
            const taskToMove = state.board.groups
                ?.find(g => g.id === sourceGroupId)
                ?.tasks?.find(t => t.id === taskId)

            if (!taskToMove) return state

            board = {
                ...state.board,
                groups: state.board.groups.map(group => {
                    if (group.id === sourceGroupId) {
                        return {
                            ...group,
                            tasks: group.tasks.filter(t => t.id !== taskId)
                        }
                    }
                    if (group.id === targetGroupId) {
                        return {
                            ...group,
                            tasks: [...group.tasks, taskToMove]
                        }
                    }
                    return group
                })
            }
            return { ...state, board }

        case UPDATE_BOARD_SOCKET:
            board = { ...state.board, ...action.updates }
            boards = state.boards.map((b) =>
                b._id === action.boardId ? board : b
            )
            return { ...state, boards, board }
        case UPDATE_GROUP_SOCKET:
            board = {
                ...state.board,
                groups: (state.board.groups || []).map(group =>
                    group.id === action.group.id
                        ? { ...group, ...action.group }
                        : group
                )
            }
            return { ...state, board }

        case REMOVE_GROUP_SOCKET:
            board = {
                ...state.board,
                groups: (state.board.groups || []).filter(group => group.id !== action.groupId)
            }
            return { ...state, board }

        case REMOVE_TASK_SOCKET:
            board = {
                ...state.board,
                groups: (state.board.groups || []).map(group =>
                    group.id === action.groupId
                        ? { ...group, tasks: group.tasks.filter(task => task.id !== action.taskId) }
                        : group
                )
            }
            return { ...state, board }

        case 'ADD_ACTIVITY':
            board = {
                ...state.board,
                activities: [...(state.board.activities || []), action.activity]
            }
            return { ...state, board }
        default:
            return state
    }
}
