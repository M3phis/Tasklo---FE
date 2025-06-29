import io from 'socket.io-client'
import { userService } from './user'

export const SOCKET_EMIT_ACTIVITY_ADD = 'activity-add'

export const SOCKET_EVENT_ADD_MSG = 'chat-add-msg'
export const SOCKET_EMIT_SEND_MSG = 'chat-send-msg'
export const SOCKET_EMIT_SET_TOPIC = 'chat-set-topic'
export const SOCKET_EMIT_USER_WATCH = 'user-watch'

export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EVENT_REVIEW_ADDED = 'review-added'
export const SOCKET_EVENT_REVIEW_REMOVED = 'review-removed'
export const SOCKET_EVENT_REVIEW_ABOUT_YOU = 'review-about-you'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

// Board events
export const SOCKET_EVENT_BOARD_UPDATED = 'board-updated'
export const SOCKET_EMIT_BOARD_WATCH = 'board-watch'
export const SOCKET_EMIT_BOARD_UNWATCH = 'board-unwatch'

// Group/List events 
export const SOCKET_EVENT_GROUP_ADDED = 'group-added'
export const SOCKET_EVENT_GROUP_UPDATED = 'group-updated'
export const SOCKET_EVENT_GROUP_DELETED = 'group-deleted'
export const SOCKET_EVENT_GROUP_MOVED = 'group-moved'
export const SOCKET_EMIT_GROUP_ADD = 'group-add'
export const SOCKET_EMIT_GROUP_UPDATE = 'group-update'
export const SOCKET_EMIT_GROUP_DELETE = 'group-delete'
export const SOCKET_EMIT_GROUP_MOVE = 'group-move'

// Task/Card events 
export const SOCKET_EVENT_TASK_ADDED = 'task-added'
export const SOCKET_EVENT_TASK_UPDATED = 'task-updated'
export const SOCKET_EVENT_TASK_DELETED = 'task-deleted'
export const SOCKET_EVENT_TASK_MOVED = 'task-moved'
export const SOCKET_EMIT_TASK_ADD = 'task-add'
export const SOCKET_EMIT_TASK_UPDATE = 'task-update'
export const SOCKET_EMIT_TASK_DELETE = 'task-delete'
export const SOCKET_EMIT_TASK_MOVE = 'task-move'

// Activity events
export const SOCKET_EVENT_ACTIVITY_ADDED = 'activity-added'


const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3031'
export const socketService = createSocketService()
// export const socketService = createDummySocketService()

window.socketService = socketService

socketService.setup()


function createSocketService() {
    var socket = null
    var watchedBoards = new Set()

    const socketService = {
        setup() {
            socket = io(baseUrl)
            const user = userService.getLoggedinUser()
            if (user) this.login(user._id)
        },
        on(eventName, cb) {
            socket.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) return
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            socket.emit(eventName, data)
        },
        login(userId) {
            socket.emit(SOCKET_EMIT_LOGIN, userId)
        },
        logout() {
            socket.emit(SOCKET_EMIT_LOGOUT)
            watchedBoards.clear()
        },
        terminate() {
            socket = null
            watchedBoards.clear()
        },

        // Board watching
        watchBoard(boardId) {
            if (!watchedBoards.has(boardId)) {
                socket.emit(SOCKET_EMIT_BOARD_WATCH, boardId)
                watchedBoards.add(boardId)
            }
        },

        unwatchBoard(boardId) {
            if (watchedBoards.has(boardId)) {
                socket.emit(SOCKET_EMIT_BOARD_UNWATCH, boardId)
                watchedBoards.delete(boardId)
            }
        },

        // Group methods
        addGroup(boardId, groupData) {
            socket.emit(SOCKET_EMIT_GROUP_ADD, { boardId, ...groupData })
        },

        updateGroup(boardId, groupId, updates) {
            socket.emit(SOCKET_EMIT_GROUP_UPDATE, { boardId, groupId, ...updates })
        },

        deleteGroup(boardId, groupId) {
            socket.emit(SOCKET_EMIT_GROUP_DELETE, { boardId, groupId })
        },
        moveGroup(boardId, groupId, sourceIndex, targetIndex) {
            console.log('Moving group', { boardId, groupId, sourceIndex, targetIndex })
            socket.emit(SOCKET_EMIT_GROUP_MOVE, {
                boardId,
                groupId,
                sourceIndex,
                targetIndex
            })
        },

        // Task methods
        addTask(boardId, groupId, taskData) {
            socket.emit(SOCKET_EMIT_TASK_ADD, { boardId, groupId, ...taskData })
        },

        updateTask(boardId, taskId, updates) {
            socket.emit(SOCKET_EMIT_TASK_UPDATE, { boardId, taskId, ...updates })
        },


        moveTask(boardId, taskId, sourceGroupId, targetGroupId) {
            socket.emit(SOCKET_EMIT_TASK_MOVE, {
                boardId,
                taskId,
                sourceGroupId,
                targetGroupId
            })
        },

        deleteTask(boardId, taskId, groupId) {
            socket.emit(SOCKET_EMIT_TASK_DELETE, { boardId, taskId, groupId })
        },
        addActivity(boardId, activity) {
            socket.emit(SOCKET_EMIT_ACTIVITY_ADD, { boardId, activity })
        },

        getWatchedBoards() {
            return Array.from(watchedBoards)
        }
    }
    return socketService
}

function createDummySocketService() {
    var listenersMap = {}
    var watchedBoards = new Set()

    const socketService = {
        listenersMap,

        setup() {
            console.log('🔧 Dummy Socket Service: Setup complete')
            listenersMap = {}
            watchedBoards.clear()

            window.addEventListener('storage', (e) => {
                if (e.key === 'dummy-socket-event' && e.newValue) {
                    try {
                        const { eventName, data, tabId } = JSON.parse(e.newValue)

                        if (tabId === socketService.tabId) return

                        console.log(`🔄 Cross-tab event received: ${eventName}`, data)

                        const listeners = listenersMap[eventName]
                        if (listeners && listeners.length > 0) {
                            listeners.forEach(listener => {
                                try {
                                    listener(data)
                                } catch (err) {
                                    console.error('🔧 Error in cross-tab listener:', err)
                                }
                            })
                        }
                    } catch (err) {
                        console.error('🔧 Error parsing cross-tab event:', err)
                    }
                }
            })

            socketService.tabId = `tab_${Date.now()}_${Math.random()}`
            console.log('🔧 Tab ID:', socketService.tabId)
        },

        terminate() {
            this.setup()
        },
        login() {
            console.log('Dummy socket service here, login - got it')
        },
        logout() {
            console.log('Dummy socket service here, logout - got it')
            watchedBoards.clear()
        },
        on(eventName, cb) {
            listenersMap[eventName] = [...(listenersMap[eventName]) || [], cb]
        },
        off(eventName, cb) {
            if (!listenersMap[eventName]) return
            if (!cb) delete listenersMap[eventName]
            else listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb)
        },

        emit(eventName, data) {
            console.log(`🔧 Dummy Socket Service: Emit "${eventName}"`, data)

            var listeners = listenersMap[eventName]

            if (eventName === SOCKET_EMIT_SEND_MSG) {
                listeners = listenersMap[SOCKET_EVENT_ADD_MSG]
            }

            if (eventName === SOCKET_EMIT_TASK_ADD) {
                listeners = listenersMap[SOCKET_EVENT_TASK_ADDED]
                data = {
                    ...data,
                    task: {
                        ...data,
                        id: `task_${Date.now()}`,
                        createdAt: new Date()
                    }
                }
            }

            if (eventName === SOCKET_EMIT_GROUP_ADD) {
                listeners = listenersMap[SOCKET_EVENT_GROUP_ADDED]
                data = {
                    ...data,
                    group: {
                        ...data,
                        id: `group_${Date.now()}`,
                        createdAt: new Date(),
                        tasks: []
                    }
                }
            }

            if (eventName === SOCKET_EMIT_TASK_MOVE) {
                listeners = listenersMap[SOCKET_EVENT_TASK_MOVED]
            }
            if (eventName === SOCKET_EMIT_TASK_UPDATE) {
                listeners = listenersMap[SOCKET_EVENT_TASK_UPDATED]
            }

            if (eventName === SOCKET_EMIT_GROUP_UPDATE) {
                listeners = listenersMap[SOCKET_EVENT_GROUP_UPDATED]
            }

            if (eventName === SOCKET_EMIT_GROUP_MOVE) {
                listeners = listenersMap[SOCKET_EVENT_GROUP_MOVED]
            }

            if (eventName === SOCKET_EMIT_TASK_DELETE) {
                listeners = listenersMap[SOCKET_EVENT_TASK_DELETED]
            }

            if (eventName === SOCKET_EMIT_GROUP_DELETE) {
                listeners = listenersMap[SOCKET_EVENT_GROUP_DELETED]
            }

            if (eventName === SOCKET_EMIT_ACTIVITY_ADD) {
                listeners = listenersMap[SOCKET_EVENT_ACTIVITY_ADDED]
                data = {
                    ...data,
                    activity: {
                        ...data.activity,
                        id: `activity_${Date.now()}`,
                        timestamp: new Date()
                    }
                }
            }

            const crossTabEvents = [
                SOCKET_EVENT_GROUP_ADDED,
                SOCKET_EVENT_GROUP_UPDATED,
                SOCKET_EVENT_GROUP_DELETED,
                SOCKET_EVENT_GROUP_MOVED,
                SOCKET_EVENT_TASK_ADDED,
                SOCKET_EVENT_TASK_UPDATED,
                SOCKET_EVENT_TASK_DELETED,
                SOCKET_EVENT_TASK_MOVED,
                SOCKET_EVENT_BOARD_UPDATED,
                SOCKET_EVENT_ACTIVITY_ADDED
            ]

            let actualEventName = eventName
            if (eventName === SOCKET_EMIT_TASK_ADD) actualEventName = SOCKET_EVENT_TASK_ADDED
            if (eventName === SOCKET_EMIT_GROUP_ADD) actualEventName = SOCKET_EVENT_GROUP_ADDED
            if (eventName === SOCKET_EMIT_TASK_MOVE) actualEventName = SOCKET_EVENT_TASK_MOVED
            if (eventName === SOCKET_EMIT_TASK_UPDATE) actualEventName = SOCKET_EVENT_TASK_UPDATED
            if (eventName === SOCKET_EMIT_GROUP_UPDATE) actualEventName = SOCKET_EVENT_GROUP_UPDATED
            if (eventName === SOCKET_EMIT_GROUP_MOVE) actualEventName = SOCKET_EVENT_GROUP_MOVED
            if (eventName === SOCKET_EMIT_TASK_DELETE) actualEventName = SOCKET_EVENT_TASK_DELETED
            if (eventName === SOCKET_EMIT_GROUP_DELETE) actualEventName = SOCKET_EVENT_GROUP_DELETED
            if (eventName === SOCKET_EMIT_ACTIVITY_ADD) actualEventName = SOCKET_EVENT_ACTIVITY_ADDED

            if (crossTabEvents.includes(actualEventName)) {
                localStorage.setItem('dummy-socket-event', JSON.stringify({
                    eventName: actualEventName,
                    data,
                    tabId: socketService.tabId,
                    timestamp: Date.now()
                }))
                console.log(`🔄 Broadcasting to other tabs: ${actualEventName}`)
            }

            if (!listeners || listeners.length === 0) {
                console.log(`🔧 Dummy Socket Service: No listeners for "${eventName}"`)
                return
            }

            console.log(`🔧 Dummy Socket Service: Triggering ${listeners.length} listeners for "${eventName}"`)
            listeners.forEach(listener => {
                try {
                    listener(data)
                } catch (err) {
                    console.error(`🔧 Dummy Socket Service: Error in listener for "${eventName}"`, err)
                }
            })
        },

        watchBoard(boardId) {
            console.log('Dummy: watching board', boardId)
            watchedBoards.add(boardId)
        },

        unwatchBoard(boardId) {
            console.log('Dummy: unwatching board', boardId)
            watchedBoards.delete(boardId)
        },

        addGroup(boardId, groupData) {
            console.log('Dummy: adding group', { boardId, groupData })
            this.emit(SOCKET_EMIT_GROUP_ADD, { boardId, ...groupData })
        },

        updateGroup(boardId, groupId, updates) {
            console.log('Dummy: updating group', { boardId, groupId, updates })
            this.emit(SOCKET_EMIT_GROUP_UPDATE, { boardId, groupId, ...updates })
        },

        deleteGroup(boardId, groupId) {
            console.log('Dummy: deleting group', { boardId, groupId })
            this.emit(SOCKET_EMIT_GROUP_DELETE, { boardId, groupId })
        },

        moveGroup(boardId, groupId, sourceIndex, targetIndex) {
            console.log('Moving group', { boardId, groupId, sourceIndex, targetIndex })
            this.emit(SOCKET_EMIT_GROUP_MOVE, {
                boardId,
                groupId,
                sourceIndex,
                targetIndex
            })
        },

        addTask(boardId, groupId, taskData) {
            console.log('Dummy: adding task', { boardId, groupId, taskData })
            this.emit(SOCKET_EMIT_TASK_ADD, { boardId, groupId, ...taskData })
        },

        updateTask(boardId, taskId, updates) {
            console.log('Dummy: updating task', { boardId, taskId, updates })
            this.emit(SOCKET_EMIT_TASK_UPDATE, { boardId, taskId, ...updates })
        },

        deleteTask(boardId, taskId, groupId) {
            console.log('Dummy: deleting task', { boardId, taskId, groupId })
            this.emit(SOCKET_EMIT_TASK_DELETE, { boardId, taskId, groupId })
        },

        moveTask(boardId, taskId, sourceGroupId, targetGroupId) {
            console.log('Dummy: moving task', { boardId, taskId, sourceGroupId, targetGroupId })
            this.emit(SOCKET_EMIT_TASK_MOVE, { boardId, taskId, sourceGroupId, targetGroupId })
        },
        addActivity(boardId, activity) {
            console.log('Dummy: adding activity', { boardId, activity })
            this.emit(SOCKET_EMIT_ACTIVITY_ADD, { boardId, activity })
        },

        getWatchedBoards() {
            return Array.from(watchedBoards)
        },

        testUserUpdate() {
            this.emit(SOCKET_EVENT_USER_UPDATED, { ...userService.getLoggedinUser(), score: 555 })
        },
        testTaskAdded() {
            this.emit(SOCKET_EVENT_TASK_ADDED, {
                boardId: 'board123',
                groupId: 'group456',
                task: { id: 'task789', title: 'New Task' }
            })
        }
    }

    window.listenersMap = listenersMap
    return socketService
}

// Basic Tests
// function cb(x) {console.log('Socket Test - Expected Puk, Actual:', x)}
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('mama', cb)
// socketService.emit('baba', 'Puk')
// socketService.off('baba', cb)
