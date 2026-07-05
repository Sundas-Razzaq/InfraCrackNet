import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";

function DashboardNavbar({
    onToggleSidebar,
    user,
}) {
    return (
        <header className="dashboard-navbar">
            <div className="navbar-left">
                <button
                    type="button"
                    className="navbar-toggle"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>

            <div className="navbar-center">
                <SearchBar />
            </div>

            <div className="navbar-right">
                <NotificationBell />

                <ProfileDropdown
                    user={user}
                />
            </div>
        </header>
    );
}

export default DashboardNavbar;