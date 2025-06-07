import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'
import boardsData from '../../data/boards.json'

const STORAGE_KEY = 'board'

export const boardService = {
    query,
    getById,
    save,
    remove,
    saveTask,
    addActivity,
    moveCard,
}

async function moveCard(boardId, groupId, taskId, newGroupId) {
    console.log('boardId', boardId)
    console.log('groupId', groupId)
    console.log('taskId', taskId)
    console.log('newGroupId', newGroupId)
    const board = await getById(boardId)
    const group = board.groups.find((g) => g.id === groupId)
    const task = group.tasks.find((t) => t.id === taskId)
    group.tasks = group.tasks.filter((t) => t.id !== taskId)
    const newGroup = board.groups.find((g) => g.id === newGroupId)
    newGroup.tasks.push(task)
    return save(board)
}


async function query(filterBy = {}) {
    var boards = await storageService.query(STORAGE_KEY)
    if (!boards.length) {
        boards = boardsData
        _save(boards)
    }
    const { txt } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        boards = boards.filter((board) => regex.test(board.title))
    }

    return boards
}
function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
    await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {
    console.log('board', board)
    var savedBoard
    if (board._id) {
        savedBoard = await storageService.put(STORAGE_KEY, board)
    } else {
        const boardToSave = {
            ...board,
            _id: makeId(),
            createdAt: Date.now(),
            createdBy: userService.getLoggedinUser(),
            activities: [],
            members: [userService.getLoggedinUser()],
        }
        savedBoard = await storageService.post(STORAGE_KEY, boardToSave)
    }
    return savedBoard
}

async function saveTask(boardId, groupId, task, activity) {
    console.log('saving task')
    const board = await getById(boardId)
    const group = board.groups.find((g) => g.id === groupId)
    const taskIdx = group.tasks.findIndex((t) => t.id === task.id)

    if (taskIdx !== -1) {
        group.tasks[taskIdx] = task
    } else {
        group.tasks.push(task)
    }

    if (activity) {
        board.activities.unshift(activity)
    }

    return save(board)
}

async function addActivity(boardId, activity) {
    const board = await getById(boardId)
    board.activities.unshift(activity)
    return save(board)
}

function _createInitialBoards() {
    return [
        {
            _id: 'x35qF',
            title: 'My First Board',
            isStarred: false,
            style: {
                backgroundImage: '',
            },
            labels: [],
            members: [],
            groups: [],
            activities: [],
            createdAt: Date.now(),
            createdBy: null,
        },
    ]
}

function _save(boards) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards))
}
