import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import CardIcon from '@atlaskit/icon/core/card'
import TagIcon from '@atlaskit/icon/core/tag';
import PersonIcon from '@atlaskit/icon/core/person';
import ImageIcon from '@atlaskit/icon/core/image';
import CalendarIcon from '@atlaskit/icon/core/calendar';
import ArrowRightIcon from '@atlaskit/icon/core/arrow-right'
import CopyIcon from '@atlaskit/icon/core/copy';
// import ArchiveBoxIcon from '@atlaskit/icon/core/archive-box';
import DeleteIcon from '@atlaskit/icon/core/delete'
import ClockIcon from '@atlaskit/icon/core/clock';
import TextLengthenIcon from '@atlaskit/icon-lab/core/text-lengthen';
import CheckCircleIcon from '@atlaskit/icon/core/check-circle'

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
    const quickEditRef = useRef(null)
    const inputRef = useRef(null);

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
                inputRef.current.focus()
                inputRef.current.select()
            }, 100)
        }
    }, [])


    function handleTitleChange(event) {
        setTitleToEdit(event.target.value)
    }

    function handleSaveTitle() {
        const updatedTask = { ...task, title: titleToEdit }
        const updatedGroup = {
            ...group,
            tasks: group.tasks.map(t => t.id === task.id ? updatedTask : t)
        }
        onUpdateTask(updatedGroup)
        onClose()
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const updatedTask = { ...task, title: titleToEdit }
        const updatedGroup = {
            ...group,
            tasks: group.tasks.map(t => t.id === task.id ? updatedTask : t)
        };
        onUpdateTask(updatedGroup)
        onClose()
    }

    function handleKeyDown(ev) {
        if (ev.key === 'Escape') {
            setTitleToEdit(task.title)
            onClose()
        }
    }

    function handleOpenCard() {
        navigate(`/board/${board._id}/${group.id}/${task.id}`)
        onClose()
    }

    function handleBackdropClick(event) {
        if (event.target.classList.contains('quick-edit-backdrop')) {
            handleSaveTitle()
        }
    }

    function handleModalClick(event) {
        event.stopPropagation()
    }

    function getLabels() {
        if (!task.labelIds || !board.labels) return []
        return board.labels.filter(label => task.labelIds.includes(label.id))
    }

    function getMembers() {
        if (!task.memberIds || !board.members) return []
        return board.members.filter(member => task.memberIds.includes(member._id))
    }

    function formatDate() {
        if (!task.date?.dueDate) return null
        const date = new Date(task.date.dueDate)
        const now = new Date()

        if (date.getFullYear() !== now.getFullYear()) {
            return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`
        }
        return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`
    }

    function getDateStatus() {
        if (!task.date?.dueDate) return ''
        if (task.date.isDone) return 'done'

        const dueDate = new Date(task.date.dueDate)
        const now = new Date()
        const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

        if (dueDate < now) return 'overdue'
        if (dueDate < oneDayFromNow) return 'due-soon'
        return ''
    }

    const labels = getLabels()
    const members = getMembers()
    const formattedDate = formatDate()
    const dateStatus = getDateStatus()

    return (
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
                    {(task.style?.backgroundImage || task.style?.backgroundColor) && (
                        <div
                            className="task-cover"
                            style={{
                                backgroundColor: task.style.backgroundColor,
                                backgroundImage: task.style.backgroundImage
                                    ? `url(${task.style.backgroundImage})`
                                    : 'none'
                            }}
                        >
                            {task.style.backgroundImage && (
                                <img
                                    src={task.style.backgroundImage}
                                    alt=""
                                    className="cover-image"
                                />
                            )}
                        </div>
                    )}

                    <div className="card-content">
                        {labels.length > 0 && (
                            <div className="card-labels">
                                {labels.map(label => (
                                    <div
                                        key={label.id}
                                        className={`card-label ${label.color || 'gray'} ${!isLabelsExtended ? 'collapsed' : ''
                                            }`}
                                        onClick={(ev) => {
                                            ev.stopPropagation()
                                            setIsLabelExtended(!isLabelsExtended)
                                        }}
                                    >
                                        <span>{isLabelsExtended ? label.title : ''}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="card-title-section">
                            <form onSubmit={handleFormSubmit}>
                                <input
                                    type="text"
                                    ref={inputRef}
                                    className="card-title-editable editing"
                                    value={titleToEdit}
                                    onChange={handleTitleChange}
                                    onKeyDown={handleKeyDown}
                                    onClick={ev => ev.stopPropagation()}
                                    autoFocus
                                />
                            </form>
                            <button className="save-card-title-edit-btn" onClick={handleSaveTitle}>Save</button>
                        </div>

                        <div className="card-info">
                            <div className="card-badges">
                                {formattedDate && (
                                    <div className={`card-badge date-badge ${dateStatus}`}>
                                        <ClockIcon label="Due date" color="currentColor" />
                                        <span>{formattedDate}</span>
                                        {task.date?.isDone && <CheckCircleIcon label="Complete" color="currentColor" />}
                                    </div>
                                )}

                                {task.description && (
                                    <div className="card-badge">
                                        <TextLengthenIcon label="TextLengthenIcon" color="currentColor" />
                                    </div>
                                )}
                            </div>

                            {members.length > 0 && (
                                <div className="card-members">
                                    {members.map(member => (
                                        <div key={member._id} className="member-avatar">
                                            {member.imgUrl ? (
                                                <img src={member.imgUrl} alt={member.fullname} />
                                            ) : (
                                                <div className="member-initials">
                                                    {member.fullname?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`quick-edit-actions ${menuSideClass}`}>
                    <button className="action-button" onClick={handleOpenCard}>
                        <CardIcon label="Open card" color="currentColor" />
                        <span>Open card</span>
                    </button>

                    <button className="action-button">
                        <TagIcon label="Edit labels" color="currentColor" />
                        <span>Edit labels</span>
                    </button>

                    <button className="action-button">
                        <PersonIcon label="Change members" color="currentColor" />
                        <span>Change members</span>
                    </button>

                    <button className="action-button">
                        <ImageIcon label="Change cover" color="currentColor" />
                        <span>Change cover</span>
                    </button>

                    <button className="action-button">
                        <CalendarIcon label="Edit dates" color="currentColor" />
                        <span>Edit dates</span>
                    </button>

                    <button className="action-button">
                        <ArrowRightIcon label="Move" color="currentColor" />
                        <span>Move</span>
                    </button>

                    <button className="action-button">
                        <CopyIcon label="Copy card" color="currentColor" />
                        <span>Copy card</span>
                    </button>

                    <button className="action-button" onClick={() => onRemoveTask(task.id)}>
                        <DeleteIcon label="Delete" color="currentColor" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div >
    )
}