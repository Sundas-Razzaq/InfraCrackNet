import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function EmptyState({ title, message, icon }) {
    return (
        <div className="empty-state">
            {icon ? (
                <span className="empty-state-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={icon} />
                </span>
            ) : null}
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-message">{message}</p>
        </div>
    );
}

export default EmptyState;
