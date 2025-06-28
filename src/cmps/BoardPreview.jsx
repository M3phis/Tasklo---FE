import { Link } from 'react-router-dom'

export function BoardPreview({ board }) {
  const { title, style, members, isStarred } = board

  // Handle both string URLs and objects with url property
  const backgroundUrl =
    typeof style?.background === 'string'
      ? style.background
      : style?.background?.url

  const isImage = backgroundUrl?.startsWith('http')

  return (
    <Link to={`/board/${board._id}`} className="board-preview">
      <div className="board-preview-content">
        {isImage ? (
          <img
            className="board-preview-img"
            src={backgroundUrl}
            alt="board background"
          />
        ) : (
          <div
            className="board-preview-img"
            style={{ backgroundColor: style.color || '#f4f5f7' }}
          ></div>
        )}
        <span>{title}</span>
      </div>
    </Link>
  )
}
