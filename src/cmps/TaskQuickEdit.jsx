import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TaskPreview } from './TaskPreview'
import { TaskDetailsDynamic, MODAL_TYPES } from './DynamicCmps/TaskDetailsDynamic'

import ClockIcon from '@atlaskit/icon/core/clock'
import DeleteIcon from '@atlaskit/icon/core/delete'
// import ArrowRightIcon from '@atlaskit/icon/core/arrow-right'
// import ArchiveBoxIcon from '@atlaskit/icon/core/archive-box';
// import CardIcon from '@atlaskit/icon/core/card'
// import TagIcon from '@atlaskit/icon/core/tag';
// import PersonIcon from '@atlaskit/icon/core/person';
// import ImageIcon from '@atlaskit/icon/core/image';
// import CopyIcon from '@atlaskit/icon/core/copy';

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
                        <button className="action-button" onClick={handleOpenCard}>
                            {/* <CardIcon label="Open card" color="currentColor" /> */}
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5 5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5ZM19 7H5V13H19V7ZM17 16C17 16.5523 17.4477 17 18 17C18.5523 17 19 16.5523 19 16C19 15.4477 18.5523 15 18 15C17.4477 15 17 15.4477 17 16ZM6 17C5.44772 17 5 16.5523 5 16C5 15.4477 5.44772 15 6 15H10C10.5523 15 11 15.4477 11 16C11 16.5523 10.5523 17 10 17H6Z" fill="#172B4D"></path></svg>
                            <span>Open card</span></button>

                        <button ref={labelsButtonRef} className="action-button" onClick={() => openModal(MODAL_TYPES.LABELS, labelsButtonRef)}>
                            {/* <TagIcon label="Edit labels" color="currentColor" /> */}
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M13.1213 2.80762C12.3403 2.02657 11.0739 2.02657 10.2929 2.80762L3.92891 9.17158C1.19524 11.9052 1.19524 16.3374 3.92891 19.0711C6.66258 21.8047 11.0947 21.8047 13.8284 19.0711L20.1924 12.7071C20.9734 11.9261 20.9734 10.6597 20.1924 9.87869L13.1213 2.80762ZM18.7782 11.2929L11.7071 4.22183L5.34313 10.5858C3.39051 12.5384 3.39051 15.7042 5.34313 17.6569C7.29575 19.6095 10.4616 19.6095 12.4142 17.6569L18.7782 11.2929ZM10 14C10 14.5523 9.55228 15 9 15C8.44772 15 8 14.5523 8 14C8 13.4477 8.44772 13 9 13C9.55228 13 10 13.4477 10 14ZM12 14C12 15.6569 10.6569 17 9 17C7.34315 17 6 15.6569 6 14C6 12.3431 7.34315 11 9 11C10.6569 11 12 12.3431 12 14Z" fill="172B4D"></path></svg>
                            <span>Edit labels</span></button>

                        <button ref={membersButtonRef} className="action-button" onClick={() => openModal(MODAL_TYPES.MEMBERS, membersButtonRef)}>
                            {/* <PersonIcon label="Change members" color="currentColor" /> */}
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.0254 3C9.25613 3 7.01123 5.23858 7.01123 8C7.01123 10.7614 9.25613 13 12.0254 13C14.7946 13 17.0395 10.7614 17.0395 8C17.0395 5.23858 14.7946 3 12.0254 3ZM9.01688 8C9.01688 9.65685 10.3638 11 12.0254 11C13.6869 11 15.0338 9.65685 15.0338 8C15.0338 6.34315 13.6869 5 12.0254 5C10.3638 5 9.01688 6.34315 9.01688 8Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M12.0254 11C16.7803 11 20.6765 14.6667 21.0254 19.3194C20.8721 20.2721 20.0439 21 19.0452 21H18.9741C18.9741 21 18.9741 21 18.9741 21L5.0767 21C5.07671 21 5.0767 21 5.0767 21L5.00562 21C4.00691 21 3.1787 20.2721 3.02539 19.3193C3.37428 14.6667 7.27038 11 12.0254 11ZM5.0767 19H18.9741C18.4875 15.6077 15.5618 13 12.0254 13C8.48892 13 5.56331 15.6077 5.0767 19ZM19.0451 19.9769V20.0231C19.0452 20.0154 19.0452 20.0077 19.0452 20C19.0452 19.9923 19.0452 19.9846 19.0451 19.9769Z" fill="#172B4D"></path></svg>
                            <span>Change members</span></button>

                        <button className="action-button">
                            {/* <ImageIcon label="Change cover" color="currentColor" /> */}
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5 5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5ZM19 7H5V13H19V7Z" fill="172B4D"></path></svg>
                            <span>Change cover</span></button>

                        <button ref={datesButtonRef} className="action-button clock-icon" onClick={() => openModal(MODAL_TYPES.DATES, datesButtonRef)}><ClockIcon label="Edit dates" color="currentColor" /><span>Edit dates</span></button>

                        {/* <button className="action-button"><ArrowRightIcon label="Move" color="currentColor" /><span>Move</span></button> */}

                        <button className="action-button">
                            {/* <CopyIcon label="Copy card" color="currentColor" /> */}
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path ffillRule="evenodd" clipRule="evenodd" d="M5 16V4.99188C5 3.8918 5.90195 3 7.00853 3H14.9915L15 3.00002V5H7V16H5ZM8 19C8 20.1046 8.89543 21 10 21H18C19.1046 21 20 20.1046 20 19V8C20 6.89543 19.1046 6 18 6H10C8.89543 6 8 6.89543 8 8V19ZM10 8V19H18V8H10Z" fill="172B4D"></path></svg>
                            <span>Copy card</span></button>

                        <button className="action-button delete-icon" onClick={() => onRemoveTask(group.id, task.id)}><DeleteIcon label="Delete" color="currentColor" /><span>Delete</span></button>

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