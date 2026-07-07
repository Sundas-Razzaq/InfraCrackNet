function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";
}

function ProfileDropdown({ user = { name: "Sundas Razzaq", role: "Engineer" } }) {
    const initials = getInitials(user.name);

    return (
        <button type="button" className="profile-dropdown" aria-label="Profile menu">
            <span className="profile-avatar" aria-hidden="true">
                {initials}
            </span>

            <span className="profile-info">
                <span className="profile-name">{user.name}</span>
                <span className="profile-role">{user.role}</span>
            </span>
        </button>
    );

}

export default ProfileDropdown;