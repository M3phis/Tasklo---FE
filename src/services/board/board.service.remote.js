import { httpService } from '../http.service'

export const boardService = {
    query,
    getById,
    save,
    remove,
    saveTask,
    addActivity
}

async function query(filterBy = {}) {
    return httpService.get('board', filterBy)
}

function getById(boardId) {
    return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
    return httpService.delete(`board/${boardId}`)
}

async function save(board) {
    var savedBoard
    if (board._id) {
        savedBoard = await httpService.put(`board/${board._id}`, board)
    } else {
        savedBoard = await httpService.post('board', board)
    }
    return savedBoard
}

async function saveTask(boardId, groupId, task, activity) {
    console.log('saving task remote')
    return httpService.put(`board/${boardId}/task/${task.id}`, { task, groupId, activity })
}

async function addActivity(boardId, activity) {
    return httpService.post(`board/${boardId}/activity`, activity)
} 