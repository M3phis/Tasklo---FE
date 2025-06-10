import { useEffect, useState } from "react"
import { AvatarList } from "../BoardHeader/AvatarList"

import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import PersonAddIcon from '@atlaskit/icon/core/person-add';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import FilterIcon from '@atlaskit/icon/core/filter'
import CalendarIcon from '@atlaskit/icon/core/calendar'
import AutomationIcon from '@atlaskit/icon/core/automation';

export function BoardHeader({
    board,
    setRsbIsOpen,
    onUpdateBoard
}) {
    const [titleToEdit, setTitleToEdit] = useState(board.title)

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

    function onShareClick(ev) {
        console.log('Share clicked - implement invite functionality')
        alert('Share/Invite functionality - implement')
    }

    function handleChangeTitle({ target }) {
        const { value } = target
        setTitleToEdit(value)
    }

    function onKeyDown(ev) {
        if (ev.key === 'Enter') {
            const updatedBoard = { ...board, title: titleToEdit }

            if (onUpdateBoard) {
                onUpdateBoard(updatedBoard)
            } else {
                console.log('Title updated:', titleToEdit)
            }
            ev.target.blur()
        } else if (ev.key === 'Escape') {
            setTitleToEdit(board.title)
            ev.target.blur()
        }
    }

    function onBlurTitle() {
        if (titleToEdit !== board.title) {
            const updatedBoard = { ...board, title: titleToEdit }

            if (onUpdateBoard) {
                onUpdateBoard(updatedBoard)
            } else {
                console.log('Title updated on blur:', titleToEdit)
            }
        }
    }

    return (
        <>
            <header className="board-header">
                <div className="header-left">
                    <input
                        className="board-title-input"
                        type="text"
                        value={titleToEdit}
                        onChange={handleChangeTitle}
                        onKeyDown={onKeyDown}
                        onBlur={onBlurTitle}
                        placeholder="Board title"
                    />
                </div>

                <div className="header-right">
                    <div className="users-section">
                        <AvatarList users={board.members || []} />
                    </div>

                    <button className="header-btn">
                        <AutomationIcon label="Automation" color="#172B4D" />
                    </button>

                    <button className="header-btn">
                        <FilterIcon label="Filter" color="#172B4D" />
                    </button>

                    <button className="header-btn" onClick={onToggleStar}>
                        {board.isStarred ?
                            <StarStarredIcon label="Remove from starred" color="#f2d600" /> :
                            <StarUnstarredIcon label="Add to starred" color="#172B4D" />
                        }
                    </button>

                    <button className="share-btn" onClick={onShareClick}>
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