import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { AvatarPreview } from "../BoardHeader/AvatarPreview"

const filterInitialState = {
    keyword: '',
    members: {
        noMembers: false,
        selectedMembers: []
    },
    cardStatus: {
        noCards: false,
        withCards: false
    },
    dueDate: {
        noDates: false,
        overdue: false,
        dueNextDay: false,
        dueNextWeek: false,
        dueNextMonth: false
    },
    labels: {
        noLabels: false,
        selectedLabels: []
    }
}

export const setFilter = (filters) => ({
    type: 'SET_FILTER',
    filters
})

export const clearFilters = () => ({
    type: 'CLEAR_FILTERS'
})

export function filterReducer(state = filterInitialState, action) {
    switch (action.type) {
        case 'SET_FILTER':
            return { ...state, ...action.filters }
        case 'CLEAR_FILTERS':
            return filterInitialState
        default:
            return state
    }
}

export function BoardHeaderFilter({ isOpen, onClose }) {
    const dispatch = useDispatch()
    const board = useSelector(state => state.boardModule.board)
    const currentFilters = useSelector(state => state.boardModule.filters || filterInitialState)

    const [localFilters, setLocalFilters] = useState(currentFilters)
    const [memberDropdownOpen, setMemberDropdownOpen] = useState(false)
    const [labelDropdownOpen, setLabelDropdownOpen] = useState(false)

    useEffect(() => {
        setLocalFilters(currentFilters)
    }, [currentFilters])

    function updateFilters(newFilters) {
        setLocalFilters(newFilters)
        dispatch(setFilter(newFilters))
    }

    function handleKeywordChange(e) {
        const newFilters = {
            ...localFilters,
            keyword: e.target.value
        }
        updateFilters(newFilters)
    }

    function handleMemberFilterChange(key, value) {
        const newFilters = {
            ...localFilters,
            members: {
                ...localFilters.members,
                [key]: value
            }
        }
        updateFilters(newFilters)
    }

    function toggleAllMembers() {
        const allMemberIds = board.members?.map(member => member._id) || []
        const currentSelected = localFilters.members.selectedMembers || []

        const newSelectedMembers = currentSelected.length === allMemberIds.length ? [] : allMemberIds

        const newFilters = {
            ...localFilters,
            members: {
                ...localFilters.members,
                selectedMembers: newSelectedMembers
            }
        }
        updateFilters(newFilters)
    }

    function toggleAllLabels() {
        const allLabelIds = board.labels?.map(label => label.id) || []
        const currentSelected = localFilters.labels.selectedLabels || []

        const newSelectedLabels = currentSelected.length === allLabelIds.length ? [] : allLabelIds

        const newFilters = {
            ...localFilters,
            labels: {
                ...localFilters.labels,
                selectedLabels: newSelectedLabels
            }
        }
        updateFilters(newFilters)
    }

    function toggleMemberSelection(memberId) {
        const currentSelected = localFilters.members.selectedMembers || []
        const newSelectedMembers = currentSelected.includes(memberId)
            ? currentSelected.filter(id => id !== memberId)
            : [...currentSelected, memberId]

        const newFilters = {
            ...localFilters,
            members: {
                ...localFilters.members,
                selectedMembers: newSelectedMembers
            }
        }
        updateFilters(newFilters)
    }

    function handleCardStatusChange(key, value) {
        const newFilters = {
            ...localFilters,
            cardStatus: {
                noCards: false,
                withCards: false
            }
        }

        if (value) {
            newFilters.cardStatus[key] = true
        }

        updateFilters(newFilters)
    }

    function handleDueDateChange(key, value) {
        const newFilters = {
            ...localFilters,
            dueDate: {
                ...localFilters.dueDate,
                [key]: value
            }
        }
        updateFilters(newFilters)
    }

    function handleLabelFilterChange(key, value) {
        const newFilters = {
            ...localFilters,
            labels: {
                ...localFilters.labels,
                [key]: value
            }
        }
        updateFilters(newFilters)
    }

    function toggleLabelSelection(labelId) {
        const currentSelected = localFilters.labels.selectedLabels || []
        const newSelectedLabels = currentSelected.includes(labelId)
            ? currentSelected.filter(id => id !== labelId)
            : [...currentSelected, labelId]

        const newFilters = {
            ...localFilters,
            labels: {
                ...localFilters.labels,
                selectedLabels: newSelectedLabels
            }
        }
        updateFilters(newFilters)
    }

    if (!isOpen) return null

    if (!board) {
        return (
            <div className="filter-sidebar">
                <div className="filter-header">
                    <h2 className="filter-title">Filter</h2>
                    <button onClick={onClose} className="filter-close-btn">
                        <CrossIcon size="small" />
                    </button>
                </div>
                <div className="filter-content">
                    <p className="filter-loading">Loading board data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="filter-overlay">
            <div className="filter-sidebar">
                <div className="filter-header">
                    <h2 className="filter-title">Filter</h2>
                    <button onClick={onClose} className="filter-close-btn">
                        <CrossIcon size="small" />
                    </button>
                </div>

                <div className="filter-content">
                    <div className="filter-section">
                        <label className="filter-label">
                            Keyword
                        </label>
                        <div className="filter-input-wrapper">
                            <svg className="filter-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Enter a keyword..."
                                value={localFilters.keyword}
                                onChange={handleKeywordChange}
                                className="filter-input"
                            />
                        </div>
                        <p className="filter-help-text">
                            Search cards, members, labels, and more.
                        </p>
                    </div>

                    <div className="filter-section">
                        <label className="filter-label">
                            Members
                        </label>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={localFilters.members.noMembers}
                                    onChange={(e) => handleMemberFilterChange('noMembers', e.target.checked)}
                                    className="filter-checkbox"
                                />
                                <div className="filter-icon-container">
                                    <svg className="filter-icon" width="24" height="24" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12.0254 3C9.25613 3 7.01123 5.23858 7.01123 8C7.01123 10.7614 9.25613 13 12.0254 13C14.7946 13 17.0395 10.7614 17.0395 8C17.0395 5.23858 14.7946 3 12.0254 3ZM9.01688 8C9.01688 9.65685 10.3638 11 12.0254 11C13.6869 11 15.0338 9.65685 15.0338 8C15.0338 6.34315 13.6869 5 12.0254 5C10.3638 5 9.01688 6.34315 9.01688 8Z" fill="#626F86"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12.0254 11C16.7803 11 20.6765 14.6667 21.0254 19.3194C20.8721 20.2721 20.0439 21 19.0452 21H18.9741C18.9741 21 18.9741 21 18.9741 21L5.0767 21C5.07671 21 5.0767 21 5.0767 21L5.00562 21C4.00691 21 3.1787 20.2721 3.02539 19.3193C3.37428 14.6667 7.27038 11 12.0254 11ZM5.0767 19H18.9741C18.4875 15.6077 15.5618 13 12.0254 13C8.48892 13 5.56331 15.6077 5.0767 19ZM19.0451 19.9769V20.0231C19.0452 20.0154 19.0452 20.0077 19.0452 20C19.0452 19.9923 19.0452 19.9846 19.0451 19.9769Z" fill="#626F86"></path>
                                    </svg>
                                </div>
                                <span className="filter-option-text">No members</span>
                            </label>

                            <div className="filter-dropdown">
                                <div className="filter-dropdown-container">
                                    <input
                                        type="checkbox"
                                        checked={board.members && localFilters.members.selectedMembers?.length === board.members.length && board.members.length > 0}
                                        onChange={toggleAllMembers}
                                        className="filter-checkbox"
                                    />
                                    <button
                                        onClick={() => setMemberDropdownOpen(!memberDropdownOpen)}
                                        className={`filter-dropdown-btn ${localFilters.members.selectedMembers?.length > 0 ? 'has-selections' : ''}`}
                                    >
                                        {localFilters.members.selectedMembers?.length > 0
                                            ? `${localFilters.members.selectedMembers.length} members selected`
                                            : 'Select members'
                                        }
                                    </button>
                                </div>

                                {memberDropdownOpen && board.members && (
                                    <div className="filter-dropdown-menu">
                                        {board.members.map(member => (
                                            <label key={member._id} className="filter-dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    checked={localFilters.members.selectedMembers?.includes(member._id) || false}
                                                    onChange={() => toggleMemberSelection(member._id)}
                                                    className="filter-checkbox"
                                                />
                                                <div className="filter-member-avatar">
                                                    <AvatarPreview user={member} size="small" showTooltip={false} />
                                                </div>
                                                <div className="filter-member-info">
                                                    <div className="filter-member-name">{member.fullname}</div>
                                                    <div className="filter-member-username">@{member.username}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="filter-section">
                        <label className="filter-label">
                            Card status
                        </label>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={localFilters.cardStatus.noCards}
                                    onChange={(e) => handleCardStatusChange('noCards', e.target.checked)}
                                    className="filter-checkbox"
                                />
                                <span className="filter-option-text">Marked as complete</span>
                            </label>

                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={localFilters.cardStatus.withCards}
                                    onChange={(e) => handleCardStatusChange('withCards', e.target.checked)}
                                    className="filter-checkbox"
                                />
                                <span className="filter-option-text">Not marked as complete</span>
                            </label>
                        </div>
                    </div>

                    <div className="filter-section">
                        <label className="filter-label">
                            Due date
                        </label>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={localFilters.dueDate.noDates}
                                    onChange={(e) => handleDueDateChange('noDates', e.target.checked)}
                                    className="filter-checkbox"
                                />
                                <div className="filter-icon-container">
                                    <svg className="filter-icon" width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M6 4V5H4.995C3.892 5 3 5.893 3 6.994V19.006C3 20.106 3.893 21 4.995 21H19.005C20.108 21 21 20.107 21 19.006V6.994C21 5.895 20.107 5 19.005 5H18V4C18 3.448 17.552 3 17 3C16.448 3 16 3.448 16 4V5H8V4C8 3.448 7.552 3 7 3C6.448 3 6 3.448 6 4ZM5.25 9.571V17.718C5.25 18.273 5.694 18.714 6.243 18.714H17.758C18.3 18.714 18.75 18.268 18.75 17.718V9.571H5.25ZM9 13V10.999H7V13H9ZM17 10.999V13H15V10.999H17ZM11 13H13.001V10.999H11V13ZM7 17V15H9V17H7ZM11 17H13.001V15H11V17ZM17 15V17H15V15H17Z" fill="#626F86"></path>
                                    </svg>
                                </div>
                                <span className="filter-option-text">No dates</span>
                            </label>

                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={localFilters.dueDate.overdue}
                                    onChange={(e) => handleDueDateChange('overdue', e.target.checked)}
                                    className="filter-checkbox"
                                />
                                <div className="filter-date-indicator filter-date-overdue">
                                    <svg className="filter-icon" width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ color: '#C9372C' }}>
                                        <path d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V6Z" fill="#FFFFFF"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="#FFFFFF"></path>
                                    </svg>
                                </div>
                                <span className="filter-option-text">Overdue</span>
                            </label>

                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={localFilters.dueDate.dueNextDay}
                                    onChange={(e) => handleDueDateChange('dueNextDay', e.target.checked)}
                                    className="filter-checkbox"
                                />
                                <div className="filter-date-indicator filter-date-warning">
                                    <svg className="filter-icon" width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V6Z" fill="#FFFFFF"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="#FFFFFF"></path>
                                    </svg>
                                </div>
                                <span className="filter-option-text">Due in the next day</span>
                            </label>

                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={localFilters.dueDate.dueNextWeek}
                                    onChange={(e) => handleDueDateChange('dueNextWeek', e.target.checked)}
                                    className="filter-checkbox"
                                />
                                <div className="filter-date-indicator filter-date-normal">
                                    <svg className="filter-icon" width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ color: '#F5CD47' }}>
                                        <path d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V6Z" fill="#626F86"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="#626F86"></path>
                                    </svg>
                                </div>
                                <span className="filter-option-text">Due in the next week</span>
                            </label>

                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={localFilters.dueDate.dueNextMonth}
                                    onChange={(e) => handleDueDateChange('dueNextMonth', e.target.checked)}
                                    className="filter-checkbox"
                                />
                                <div className="filter-date-indicator filter-date-normal">
                                    <svg className="filter-icon" width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ color: '#F5CD47' }}>
                                        <path d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V6Z" fill="#626F86"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="#626F86"></path>
                                    </svg>
                                </div>
                                <span className="filter-option-text">Due in the next month</span>
                            </label>
                        </div>
                    </div>

                    <div className="filter-section">
                        <label className="filter-label">
                            Labels
                        </label>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={localFilters.labels.noLabels}
                                    onChange={(e) => handleLabelFilterChange('noLabels', e.target.checked)}
                                    className="filter-checkbox"
                                />
                                <div className="filter-icon-container">
                                    <svg className="filter-icon" width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.1213 2.80762C12.3403 2.02657 11.0739 2.02657 10.2929 2.80762L3.92891 9.17158C1.19524 11.9052 1.19524 16.3374 3.92891 19.0711C6.66258 21.8047 11.0947 21.8047 13.8284 19.0711L20.1924 12.7071C20.9734 11.9261 20.9734 10.6597 20.1924 9.87869L13.1213 2.80762ZM18.7782 11.2929L11.7071 4.22183L5.34313 10.5858C3.39051 12.5384 3.39051 15.7042 5.34313 17.6569C7.29575 19.6095 10.4616 19.6095 12.4142 17.6569L18.7782 11.2929ZM10 14C10 14.5523 9.55228 15 9 15C8.44772 15 8 14.5523 8 14C8 13.4477 8.44772 13 9 13C9.55228 13 10 13.4477 10 14ZM12 14C12 15.6569 10.6569 17 9 17C7.34315 17 6 15.6569 6 14C6 12.3431 7.34315 11 9 11C10.6569 11 12 12.3431 12 14Z" fill="#626F86"></path>
                                    </svg>
                                </div>
                                <span className="filter-option-text">No labels</span>
                            </label>

                            {board.labels && board.labels.slice(0, 3).map(label => (
                                <label key={label.id} className="filter-option">
                                    <input
                                        type="checkbox"
                                        checked={localFilters.labels.selectedLabels?.includes(label.id) || false}
                                        onChange={() => toggleLabelSelection(label.id)}
                                        className="filter-checkbox"
                                    />
                                    <div className="filter-label-badge" style={{ backgroundColor: label.color }}>
                                        {label.title}
                                    </div>
                                </label>
                            ))}

                            <div className="filter-dropdown">
                                <div className="filter-dropdown-container">
                                    <input
                                        type="checkbox"
                                        checked={board.labels && localFilters.labels.selectedLabels?.length === board.labels.length && board.labels.length > 0}
                                        onChange={toggleAllLabels}
                                        className="filter-checkbox"
                                    />
                                    <button
                                        onClick={() => setLabelDropdownOpen(!labelDropdownOpen)}
                                        className={`filter-dropdown-btn ${localFilters.labels.selectedLabels?.length > 0 ? 'has-selections' : ''}`}
                                    >
                                        {localFilters.labels.selectedLabels?.length > 0
                                            ? `${localFilters.labels.selectedLabels.length} labels selected`
                                            : 'Select labels'
                                        }
                                    </button>
                                </div>

                                {labelDropdownOpen && board.labels && (
                                    <div className="filter-dropdown-menu">
                                        {board.labels.map(label => (
                                            <label key={label.id} className="filter-dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    checked={localFilters.labels.selectedLabels?.includes(label.id) || false}
                                                    onChange={() => toggleLabelSelection(label.id)}
                                                    className="filter-checkbox"
                                                />
                                                <div className="filter-label-badge" style={{ backgroundColor: label.color }}>
                                                    {label.title}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const filterUtils = {
    filterTasks: (tasks, filters, board) => {
        if (!tasks || !filters) return tasks || []

        return tasks.filter(task => {
            if (filters.keyword && filters.keyword.trim()) {
                const keyword = filters.keyword.toLowerCase().trim()
                const matchesKeyword =
                    (task.title && task.title.toLowerCase().includes(keyword)) ||
                    (task.description && task.description.toLowerCase().includes(keyword)) ||
                    (task.comments && task.comments.some(comment =>
                        comment.txt && comment.txt.toLowerCase().includes(keyword)
                    ))
                if (!matchesKeyword) return false
            }

            if (filters.members?.noMembers && task.memberIds && task.memberIds.length > 0) {
                return false
            }

            if (filters.members?.selectedMembers && filters.members.selectedMembers.length > 0) {
                const taskMembers = task.memberIds || []
                const hasSelectedMember = filters.members.selectedMembers.some(memberId =>
                    taskMembers.includes(memberId)
                )
                if (!hasSelectedMember) return false
            }

            if (filters.cardStatus?.noCards) {
                if (task.status !== 'done') return false
            }

            if (filters.cardStatus?.withCards) {
                if (task.status === 'done') return false
            }

            if (filters.dueDate?.noDates && task.dueDate) {
                return false
            }

            if (filters.dueDate?.overdue) {
                if (!task.dueDate) return false
                if (task.status === 'done') return false
                const now = Date.now()
                const dueDate = new Date(task.dueDate).getTime()
                if (dueDate >= now) return false
            }

            if (filters.dueDate?.dueNextDay) {
                if (!task.dueDate) return false
                const now = Date.now()
                const tomorrow = now + (24 * 60 * 60 * 1000)
                const dueDate = new Date(task.dueDate).getTime()
                if (dueDate < now || dueDate > tomorrow) return false
            }

            if (filters.dueDate?.dueNextWeek) {
                if (!task.dueDate) return false
                const now = Date.now()
                const nextWeek = now + (7 * 24 * 60 * 60 * 1000)
                const dueDate = new Date(task.dueDate).getTime()
                if (dueDate < now || dueDate > nextWeek) return false
            }

            if (filters.dueDate?.dueNextMonth) {
                if (!task.dueDate) return false
                const now = Date.now()
                const nextMonth = now + (30 * 24 * 60 * 60 * 1000)
                const dueDate = new Date(task.dueDate).getTime()
                if (dueDate < now || dueDate > nextMonth) return false
            }

            if (filters.labels?.noLabels && task.labelIds && task.labelIds.length > 0) {
                return false
            }

            if (filters.labels?.selectedLabels && filters.labels.selectedLabels.length > 0) {
                const taskLabels = task.labelIds || []
                const hasSelectedLabel = filters.labels.selectedLabels.some(labelId =>
                    taskLabels.includes(labelId)
                )
                if (!hasSelectedLabel) return false
            }

            return true
        })
    },

    hasActiveFilters: (filters) => {
        if (!filters) return false
        return !!(
            filters.keyword ||
            filters.members?.noMembers ||
            (filters.members?.selectedMembers && filters.members.selectedMembers.length > 0) ||
            filters.cardStatus?.noCards ||
            filters.cardStatus?.withCards ||
            (filters.dueDate && Object.values(filters.dueDate).some(Boolean)) ||
            filters.labels?.noLabels ||
            (filters.labels?.selectedLabels && filters.labels.selectedLabels.length > 0)
        )
    },

    getActiveFilterCount: (filters) => {
        if (!filters) return 0
        let count = 0
        if (filters.keyword) count++
        if (filters.members?.noMembers || (filters.members?.selectedMembers && filters.members.selectedMembers.length > 0)) count++
        if (filters.cardStatus?.noCards || filters.cardStatus?.withCards) count++
        if (filters.dueDate && Object.values(filters.dueDate).some(Boolean)) count++
        if (filters.labels?.noLabels || (filters.labels?.selectedLabels && filters.labels.selectedLabels.length > 0)) count++
        return count
    }
}