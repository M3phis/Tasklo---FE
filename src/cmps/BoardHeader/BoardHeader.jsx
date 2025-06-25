import { useEffect, useState } from "react"
import { AvatarList } from "../BoardHeader/AvatarList"

import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred'
import StarStarredIcon from '@atlaskit/icon/core/star-starred'
import PersonAddIcon from '@atlaskit/icon/core/person-add'
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal'
import FilterIcon from '@atlaskit/icon/core/filter'
import CalendarIcon from '@atlaskit/icon/core/calendar'
import AutomationIcon from '@atlaskit/icon/core/automation'

export function BoardHeader({
    board,
    setRsbIsOpen,
    onUpdateBoard,
    setFilterIsOpen,
    activeFilterCount,
    filteredTaskCount,
    onClearAllFilters

}) {
    const [titleToEdit, setTitleToEdit] = useState(board.title)
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    useEffect(() => {
        setTitleToEdit(board.title)
    }, [board._id])

    async function onToggleStar(ev) {
        ev.stopPropagation()
        ev.preventDefault()

        const updatedBoard = { ...board, isStarred: !board.isStarred }

        if (onUpdateBoard) {
            onUpdateBoard(updatedBoard)
        } else {
            console.log('Star toggled:', updatedBoard.isStarred)
        }
    }

    function handleChangeTitle({ target }) {
        const { value } = target
        setTitleToEdit(value)
    }

     function handleTitleClick() {
        if (!isEditingTitle) {
            setIsEditingTitle(true)
        }
    }

     function handleKeyDown(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault()
            ev.target.blur() // This will trigger handleTitleBlur
        } else if (ev.key === 'Escape') {
            setTitleToEdit(board.title) // Reset to original
            setIsEditingTitle(false)
        }
    }

    function handleTitleBlur() {
        setIsEditingTitle(false)
        if (titleToEdit.trim() && titleToEdit !== board.title) {
            const updatedBoard = { ...board, title: titleToEdit.trim() }
            if (onUpdateBoard) {
                onUpdateBoard(updatedBoard)
            } else {
                console.log('Title updated on blur:', titleToEdit)
            }
        } else {
            setTitleToEdit(board.title || '')
        }
    }

    return (
        <>
            <header className="board-header">
               <div className="header-left">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={titleToEdit}
                            onChange={handleChangeTitle}
                            onBlur={handleTitleBlur}
                            onKeyDown={handleKeyDown}
                            onFocus={(e) => e.target.select()}
                            autoFocus
                            className={`board-title-input ${isEditingTitle ? 'editing' : ''}`}
                            placeholder="Board title"
                        />
                    ) : (
                        <h1
                            className="board-title-display"
                            onClick={handleTitleClick}
                        >
                            {board.title || 'Untitled Board'}
                        </h1>
                    )}
                </div>

                <div className="header-right">
                    <div className="users-section">
                        <AvatarList users={board.members || []} />
                    </div>

                    {/* <button className="header-btn">
                        <AutomationIcon label="Automation" color="#172B4D" />
                    </button> */}

                    {activeFilterCount > 0 ? (
                        <div className="filter-count-inline" onClick={() => setFilterIsOpen(true)}>
                            <FilterIcon label="Filter" color="white" />
                            <div className="filter-count-badge">
                                <span className="filter-circle"></span>
                                <span className="filter-count-text">{filteredTaskCount}</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onClearAllFilters()
                                }}
                                className="filter-clear-all-btn"
                            >
                                Clear all
                            </button>
                        </div>
                    ) : (
                        <button
                            className="header-btn"
                            onClick={() => setFilterIsOpen(true)}
                        >
                            <FilterIcon label="Filter" color="#172B4D" />
                        </button>
                    )}

                    <button className="header-btn" onClick={onToggleStar}>
                        {board.isStarred ?
                            <StarStarredIcon label="Remove from starred" color="#f2d600" /> :
                            <StarUnstarredIcon label="Add to starred" color="#172B4D" />
                        }
                    </button>

                    <button className="share-btn">
                        <PersonAddIcon label="Share" color="#FFFFFF" />
                        <span>Share</span>
                    </button>

                    {setRsbIsOpen && (
                        <button className="menu-btn" onClick={() => setRsbIsOpen(true)}>
                            <ShowMoreHorizontalIcon label="More options" color="#172B4D" />
                        </button>
                    )}
                </div>
            </header>

        </>
    )
}