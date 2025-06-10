import { AvatarPreview } from "./AvatarPreview"

export function AvatarList({ users = [] }) {
    if (!users || users.length === 0) {
        return null
    }

    return (
        <div className="avatar-list">
            {users.map(user => (
                <div key={user._id} className="avatar-wrapper">
                    <AvatarPreview user={user} size="medium" showTooltip={true} />
                </div>
            ))}
        </div>
    )
}
