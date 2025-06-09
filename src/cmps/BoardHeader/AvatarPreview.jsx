import { utilService } from "../../services/util.service"

export function AvatarPreview({ user, size = "medium", showTooltip = true }) {
    if (!user) {
        return null
    }

    let initials
    if (!user.imgUrl) {
        initials = utilService.getInitials(user.fullName || user.fullname)
    }

    const sizeClasses = {
        small: "avatar-small",
        medium: "avatar-medium",
        large: "avatar-large"
    }

    const className = `avatar ${sizeClasses[size] || sizeClasses.medium}`
    const tooltipText = user.fullName || user.fullname || user.username

    return (
        <div className={className} title={showTooltip ? tooltipText : ""}>
            {user.imgUrl ? (
                <img src={user.imgUrl} alt={tooltipText} />
            ) : (
                <div
                    className="initials"
                    style={{ backgroundColor: initials.color }}
                >
                    {initials.initials}
                </div>
            )}
        </div>
    )
}