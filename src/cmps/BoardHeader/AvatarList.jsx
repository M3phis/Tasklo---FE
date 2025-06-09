import { AvatarPreview } from "./AvatarPreview"

export function AvatarList({ users = [], maxUsers = Infinity }) {
    if (!users || users.length === 0) {
        return null
    }

    const displayUsers = users.slice(0, maxUsers)
    const remainingCount = users.length - maxUsers
    const showMoreButton = remainingCount > 0

    return (
        <div className="avatar-list">
            {displayUsers.map(user => (
                <div key={user._id} className="avatar-wrapper">
                    <AvatarPreview user={user} size="medium" showTooltip={true} />
                </div>
            ))}

            {showMoreButton && (
                <button className="more" title={`${remainingCount} more members`}>
                    +{remainingCount}
                </button>
            )}
        </div>
    )
} 