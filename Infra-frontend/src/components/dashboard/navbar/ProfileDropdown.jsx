import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

function ProfileDropdown({

    user = {

        name: "Sundas Razzaq",

        role: "Engineer"

    }

}) {

    const initials = user.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (

        <button
            type="button"
            className="profile-dropdown"
            aria-label="Profile Menu"
        >

            <span className="profile-avatar">

                {initials}

            </span>

            <span className="profile-info">

                <span className="profile-name">

                    {user.name}

                </span>

                <span className="profile-role">

                    {user.role}

                </span>

            </span>

            <FontAwesomeIcon icon={faChevronDown} />

        </button>

    );

}

export default ProfileDropdown;