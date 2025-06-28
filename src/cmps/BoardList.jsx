import { BoardPreview } from './BoardPreview'
import { CreateMenuContainer } from './CreateMenuContainer.jsx'
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred'
import StarStarredIcon from '@atlaskit/icon/core/star-starred'

export function BoardList({
  boards,
  onRemoveBoard,
  onUpdateBoard,
  onToggleStarred,
  starBoards,
}) {
  return (
    <section>
      <ul className="board-list">
        {boards.map((board) => (
          <li key={board._id}>
            <div className="board-preview-wrapper">
              <BoardPreview board={board} />
              <button
                className="toggle-starred"
                onClick={() => onToggleStarred(board._id)}
                tabIndex={-1}
              >
                {board.isStarred ? (
                  <StarStarredIcon label="" color="white" />
                ) : (
                  <StarUnstarredIcon label="" color="white" />
                )}
              </button>
            </div>
          </li>
        ))}

        {!starBoards && (
          <li>
            <CreateMenuContainer
              placement="right"
              trigger={({ onClick, ref }) => (
                <div
                  ref={ref}
                  className="create-board-preview"
                  onClick={onClick}
                >
                  Create new board
                </div>
              )}
            />
          </li>
        )}
      </ul>
    </section>
  )
}
