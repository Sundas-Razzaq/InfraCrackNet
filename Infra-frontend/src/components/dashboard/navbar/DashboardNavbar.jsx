import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";

function DashboardNavbar({ user }) {
    return (
        <header className="dashboard-navbar">
            <div className="navbar-left">

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