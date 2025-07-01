import { httpService } from '../http.service'

export const boardService = {
  query,
  getById,
  save,
  remove,
  saveTask,
  addActivity,
  createBoardWithAI,
  moveCard,
}

async function query(filterBy = {}) {
  return httpService.get('board', filterBy)
}

function getById(boardId) {
  return httpService.get(`board/${boardId}`)
}

function remove(boardId) {
  return httpService.delete(`board/${boardId}`)
}

async function save(board) {
  if (board._id) {
    return httpService.put(`board/${board._id}`, board)
  } else {
    return httpService.post('board', board)
  }
}

async function saveTask(boardId, groupId, task, activity) {
  return httpService.put(`board/${boardId}/task/${task.id}`, {
    task,
    groupId,
    activity,
  })
}

async function addActivity(boardId, activity) {
  return httpService.post(`board/${boardId}/activity`, activity)
}

async function createBoardWithAI({ description, timeline }) {
  return httpService.post('ai/board', { description, timeline })
}

async function moveCard(boardId, groupId, taskId, newGroupId) {
  return httpService.put(`board/${boardId}/move-task`, {
    fromGroupId: groupId,
    toGroupId: newGroupId,
    taskId,
  })
}
