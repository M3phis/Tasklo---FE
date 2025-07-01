const { DEV, VITE_LOCAL } = import.meta.env
import { utilService } from '../../services/util.service'

import { boardService as local } from './board.service.local'
import { boardService as remote } from './board.service.remote'

function getEmptyBoard() {
  return {
    title: '',
    isStarred: false,
    style: {
      backgroundImage: '',
    },
    labels: [],
    members: [],
    groups: [],
    activities: [],
  }
}

function getEmptyTask() {
  return {
    id: utilService.makeId()(),
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: null,
    memberIds: [],
    labelIds: [],
    checklists: [],
    style: {},
  }
}

function getEmptyActivity() {
  return {
    id: makeId(),
    txt: '',
    createdAt: Date.now(),
    byMember: null,
    group: null,
    task: null,
  }
}

function getEmptyFilter() {
  return {
    txt: '',
  }
}

function getFilteredBoards(boards, filterBy) {
  if (!filterBy.txt) return boards
  const regex = new RegExp(filterBy.txt, 'i')
  return boards.filter((board) => regex.test(board.title))
}

console.log('VITE_LOCAL value:', VITE_LOCAL)
console.log('Using service:', VITE_LOCAL === 'true' ? 'local' : 'remote')

const service = VITE_LOCAL === 'true' ? local : remote
export const boardService = {
  getEmptyBoard,
  getEmptyTask,
  getEmptyActivity,
  getEmptyFilter,
  getFilteredBoards,
  ...service,
}

//* Easy access to this service from the dev tools console
if (DEV) window.boardService = boardService
