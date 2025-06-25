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

        default:
            return state
    }
}
