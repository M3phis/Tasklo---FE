import { BoardPreview } from './BoardPreview'

export function BoardList({ boards, onRemoveBoard, onUpdateBoard }) {
  return (
    <section>
      <ul className="board-list">
        {boards.map((board) => (
          <li key={board._id}>
            <BoardPreview board={board} />
            <div className="actions">
              {/* <button onClick={() => onRemoveBoard(board._id)}>x</button>
              <button onClick={() => onUpdateBoard(board)}>Edit</button> */}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
