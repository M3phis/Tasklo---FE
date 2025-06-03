

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { moveCard } from '../store/board.actions'
import { useDispatch } from 'react-redux'
import { createPortal } from 'react-dom'
import EditIcon from '@atlaskit/icon/glyph/edit'
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle'
import MediaServicesPreselectedIcon from '@atlaskit/icon/glyph/media-services/preselected'
import editpenSvg from '../svg/editpen.svg'

export function TaskPreview({ task, group, onRemoveTask, onUpdateTask, onOpenQuickEdit, isEmptyPlaceholder = false }) {
    const [isDragging, setIsDragging] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isDraggedOver, setIsDraggedOver] = useState(false)
    const [preview, setPreview] = useState(null)
    const { boardId } = useParams()
    const dispatch = useDispatch()
    const ref = useRef(null)
    const isDone = task?.status === 'done'

    useEffect(() => {
        const element = ref.current
        if (!element) return

        if (isEmptyPlaceholder) {
            return dropTargetForElements({
                element,
                getData() {
                    return { groupId: group.id, type: 'empty-list' }
                },
                onDragEnter() {
                    setIsDraggedOver(true)
                },
                onDragLeave() {
                    setIsDraggedOver(false)
                },
                onDrop: async ({ source }) => {
                    setIsDraggedOver(false)

                    if (source.data.groupId !== group.id) {
                        try {
                            await moveCard(
                                boardId,
                                source.data.groupId,
                                source.data.id,
                                group.id
                            )
                        } catch (error) {
                            console.error('Failed to move card:', error)
                        }
                    }
                },
                canDrop({ source }) {
                    return source.data.groupId !== group.id
                },
                getIsSticky() {
                    return true
                }
            })
        }

        return combine(
            draggable({
                element,
                getInitialData() {
                    return { ...task, groupId: group.id }
                },
                onDragStart(event) {
                    setIsDragging(true)
                },
                onDragOver(event) {
                    event.preventDefault()
                },
                onDrop() {
                    setIsDragging(false)
                    setPreview(null)
                },
                onGenerateDragPreview({ nativeSetDragImage }) {
                    setCustomNativeDragPreview({
                        nativeSetDragImage,
                        render({ container }) {
                            setPreview(container)
                        },
                    })
                },
            }),
            dropTargetForElements({
                element,
                getData() {
                    return { ...task, groupId: group.id, type: 'task' }
                },
                onDrop: async ({ source, self }) => {
                    try {
                        await moveCard(
                            boardId,
                            source.data.groupId,
                            source.data.id,
                            self.data.groupId
                        )
                    } catch (error) {
                        console.error('Failed to move card:', error)
                    }
                },
                canDrop({ source }) {
                    return source.data.groupId !== group.id
                }
            })
        )
    }, [boardId, group.id, task, dispatch, isEmptyPlaceholder])

    function handleTaskClick(e) {
        if (isEmptyPlaceholder) return
        if (e.target.closest('.task-edit-btn') || e.target.closest('.remove-task-btn') || e.target.closest('.task-done-btn')) {
            return
        }
        console.log('Open task details for:', task.title)
    }
    function handleEditClick(e) {
        e.stopPropagation()
        if (onOpenQuickEdit) {
            onOpenQuickEdit(task, group.id)
        }
    }

    function handleDoneToggle(e) {
        e.stopPropagation()

        const updatedTask = {
            ...task,
            status: isDone ? 'in-progress' : 'done',
            ...(isDone ? {} : { completedAt: new Date().toISOString() })
        }

        const updatedGroup = {
            ...group,
            tasks: group.tasks.map(t =>
                t.id === task.id ? updatedTask : t
            )
        }

        onUpdateTask(updatedGroup)
    }

    if (isEmptyPlaceholder) {
        return (
            <div
                ref={ref}
                className={`task-empty-placeholder ${isDraggedOver ? 'drag-over' : ''}`}
            >
                <p className="empty-message">
                    {isDraggedOver ? 'Drop task here' : 'No cards in this list'}
                </p>
            </div>
        )
    }
    return (
        <>
            <div
                key={task.id}
                ref={ref}
                className={`task-preview-Drag ${isDragging ? 'drag-cursor' : ''}`}
                onClick={handleTaskClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    cursor: isDragging ? 'grabbing' : 'pointer'
                }}
            >


                <div className={`task-preview ${isDone ? 'task-done' : ''}`}>
                    <div className="task-content">
                        {isHovered && (
                            <button className="task-edit-btn" onClick={handleEditClick} title="Quick edit"> <img src={editpenSvg} alt="Edit" width="14" height="14" /></button>
                        )}

                        <div className="task-header">
                            {(isDone || isHovered) && (
                                <button className="task-done-btn" onClick={handleDoneToggle} title={isDone ? "Mark as undone" : "Mark as done"}>
                                    {isDone ? (
                                        <CheckCircleIcon label="Mark as undone" size="small" primaryColor="#00875A" />
                                    ) : (
                                        <MediaServicesPreselectedIcon label="Mark as done" size="small" />
                                    )}
                                </button>
                            )}

                            <div className="task-title">{task.title}</div>
                        </div>
                    </div>
                </div>
            </div>

            {preview && createPortal(<TaskPreviewDrag task={task} isDone={isDone} />, preview)}
        </>
    )
}

const TaskPreviewDrag = ({ task, isDone }) => {
    return (
        <div className={`task-preview-drag ${isDone ? 'task-done' : ''}`}>
            <p>{task.title}</p>
        </div>
    )
}