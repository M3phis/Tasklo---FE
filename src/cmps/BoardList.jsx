import { BoardPreview } from './BoardPreview'
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred'
import StarStarredIcon from '@atlaskit/icon/core/star-starred'

export function BoardList({
  boards,
  onRemoveBoard,
  onUpdateBoard,
  onToggleStarred,
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
                  <StarStarredIcon label="" />
                ) : (
                  <StarUnstarredIcon label="" />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
