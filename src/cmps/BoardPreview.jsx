import { Link } from 'react-router-dom'

export function BoardPreview({ board }) {
  const { title, style, members, isStarred } = board

  return (
    <Link to={`/board/${board._id}`} className="board-preview">
      <div
        className="board-preview-content"
        style={{
          backgroundImage: style.backgroundImage,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#026aa7',
        }}
      >
        <h3>{title}</h3>
        <div className="board-preview-info">
          {isStarred && <span className="star">★</span>}
          {members && members.length > 0 && (
            <div className="members">
              {members
                .slice(0, 3)
                .map((member) =>
                  member && member.imgUrl ? (
                    <img
                      key={member._id}
                      src={member.imgUrl}
                      alt={member.fullname || 'Member'}
                      title={member.fullname || 'Member'}
                    />
                  ) : null
                )}
              {members.length > 3 && <span>+{members.length - 3}</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
