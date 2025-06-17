import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TaskPreview } from './TaskPreview'
import { TaskDetailsDynamic, MODAL_TYPES } from './DynamicCmps/TaskDetailsDynamic'

import CardIcon from '@atlaskit/icon/core/card'
import TagIcon from '@atlaskit/icon/core/tag';
import PersonIcon from '@atlaskit/icon/core/person';
import ImageIcon from '@atlaskit/icon/core/image';
import CalendarIcon from '@atlaskit/icon/core/calendar';
import ArrowRightIcon from '@atlaskit/icon/core/arrow-right'
import CopyIcon from '@atlaskit/icon/core/copy';
// import ArchiveBoxIcon from '@atlaskit/icon/core/archive-box';
import DeleteIcon from '@atlaskit/icon/core/delete'

export function TaskQuickEdit({
    task,
    group,
    board,
    onClose,
    onUpdateTask,
    onRemoveTask,
    position,
    isLabelsExtended,
    setIsLabelExtended
}) {
    const navigate = useNavigate()
    const [titleToEdit, setTitleToEdit] = useState(task.title)
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })
    const [calculatedPosition, setCalculatedPosition] = useState(position)
    const [menuSideClass, setMenuSideClass] = useState('')
    const [activeModal, setActiveModal] = useState(null)
    const [modalTriggerRef, setModalTriggerRef] = useState(null)
    const quickEditRef = useRef(null)
    const inputRef = useRef(null)
    const labelsButtonRef = useRef(null)
    const membersButtonRef = useRef(null)
    const datesButtonRef = useRef(null)

    useEffect(() => {
        function updateSize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    useLayoutEffect(() => {
        if (quickEditRef.current && position) {
            const modalRect = quickEditRef.current.getBoundingClientRect()
            let newTop = position.y
            let newLeft = position.x

            if (position.y + modalRect.height > windowSize.height) {
                newTop = Math.max(10, windowSize.height - modalRect.height - 10)
            }

            if (position.x + modalRect.width > windowSize.width) {
                newLeft = Math.max(10, windowSize.width - modalRect.width - 10)
                setMenuSideClass('left-side')
            } else {
                setMenuSideClass('')
            }

            setCalculatedPosition({ x: newLeft, y: newTop })
        }
    }, [position, windowSize])


    useEffect(() => {
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
                inputRef.current.select();
                autoResizeTextarea(inputRef.current);
            }, 100);
        }
    }, [])

    function handleSaveTitle() {
        const updatedTask = { ...task, title: titleToEdit }
        const updatedGroup = {
            ...group,
            tasks: group.tasks.map(t => t.id === task.id ? updatedTask : t)
        }
        onUpdateTask(updatedGroup)
        onClose()
    }

    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    function handleTitleChange(event) {
        setTitleToEdit(event.target.value);
        autoResizeTextarea(event.target);
    }


    function handleKeyDown(ev) {
        if (ev.key === 'Escape') {
            if (activeModal) {
                setActiveModal(null)
                setModalTriggerRef(null)
            } else {
                setTitleToEdit(task.title)
                onClose()
            }
        }
    }

    function handleCancelEdit() {
        setTitleToEdit(task.title)
        onClose()
    }

    function handleOpenCard() {
        navigate(`/board/${board._id}/${group.id}/${task.id}`)
        onClose()
    }

    function handleBackdropClick(event) {
        if (event.target.classList.contains('quick-edit-backdrop')) {
            event.stopPropagation()
            handleCancelEdit()
        }
    }

    function handleModalClick(event) {
        event.stopPropagation()
    }

    function openModal(modalType, triggerRef) {
        setActiveModal(modalType)
        setModalTriggerRef(triggerRef)
    }

    function closeModal() {
        setActiveModal(null)
        setModalTriggerRef(null)
    }

    return (
        <>
            <div className="quick-edit-backdrop" onClick={handleBackdropClick}>
                <div
                    ref={quickEditRef}
                    className={`task-quick-edit ${menuSideClass}`}
                    style={{
                        position: 'fixed',
                        top: calculatedPosition.y,
                        left: calculatedPosition.x,
                        zIndex: 1000
                    }}
                    onClick={handleModalClick}
                >
                    <div className="quick-edit-card">
                        <TaskPreview
                            task={task}
                            group={group}
                            board={board}
                            onRemoveTask={onRemoveTask}
                            onUpdateTask={onUpdateTask}
                            isLabelsExtended={isLabelsExtended}
                            setIsLabelExtended={setIsLabelExtended}
                            isEditing={true}
                            editableTitle={titleToEdit}
                            onTitleChange={handleTitleChange}
                            onSaveTitle={handleSaveTitle}
                            onCancelEdit={handleCancelEdit}
                            inputRef={inputRef}
                        />
                    </div>


                    <div className={`quick-edit-actions ${menuSideClass}`}>
                        <button className="action-button" onClick={handleOpenCard}><CardIcon label="Open card" color="currentColor" /><span>Open card</span></button>

                        <button ref={labelsButtonRef} className="action-button" onClick={() => openModal(MODAL_TYPES.LABELS, labelsButtonRef)}><TagIcon label="Edit labels" color="currentColor" /><span>Edit labels</span></button>

                        <button ref={membersButtonRef} className="action-button" onClick={() => openModal(MODAL_TYPES.MEMBERS, membersButtonRef)}><PersonIcon label="Change members" color="currentColor" /><span>Change members</span></button>

                        <button className="action-button"><ImageIcon label="Change cover" color="currentColor" /><span>Change cover</span></button>

                        <button ref={datesButtonRef} className="action-button" onClick={() => openModal(MODAL_TYPES.DATES, datesButtonRef)}><CalendarIcon label="Edit dates" color="currentColor" /><span>Edit dates</span></button>

                        {/* <button className="action-button">
                        <ArrowRightIcon label="Move" color="currentColor" />
                        <span>Move</span>
                    </button> */}

                        <button className="action-button"><CopyIcon label="Copy card" color="currentColor" /><span>Copy card</span></button>

                        <button className="action-button" onClick={() => onRemoveTask(group.id, task.id)}><DeleteIcon label="Delete" color="currentColor" /><span>Delete</span></button>

                    </div>
                </div>
            </div>

            {activeModal && (
                <TaskDetailsDynamic
                    type={activeModal}
                    task={task}
                    board={board}
                    group={group}
                    onClose={closeModal}
                    onUpdateTask={onUpdateTask}
                    position={calculatedPosition}
                    triggerRef={modalTriggerRef}
                />
            )}
        </>
    )
}