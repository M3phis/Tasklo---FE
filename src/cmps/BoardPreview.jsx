import { Link } from 'react-router-dom'

export function BoardPreview({ board }) {
  const { title, style, members, isStarred } = board

  return (
    <Link to={`/board/${board._id}`} className="board-preview">
      <div className="board-preview-content">
        <img
          className="board-preview-img"
          src={style.background}
          alt="background color"
        />
        <span>{title}</span>
      </div>
    </Link>
  )
}
