import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function DashboardHeader({ userName, subtitle, buttonText, onButtonClick }) {
    return (
        <header className="dashboard-header">
            <div className="dashboard-header-left">
                <h1 className="dashboard-title">Good Morning, {userName}</h1>
                <p className="dashboard-subtitle">{subtitle}</p>
            </div>

            <div className="dashboard-header-right">
                <button type="button" className="dashboard-action-btn" onClick={onButtonClick}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>{buttonText}</span>
                </button>
            </div>
        </header>
    );
}

export default DashboardHeader;
