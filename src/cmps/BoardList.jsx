import { BoardPreview } from './BoardPreview'
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
          <div className="create-board-preview">Create new board </div>
        )}
      </ul>
    </section>
  )
}
