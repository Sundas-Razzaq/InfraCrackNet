import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EmptyState = ({
    icon,
    title,
    message,
    actionLabel,
    actionIcon,
    onAction,
}) => {
    return (
        <div className="empty-projects">
            <div className="empty-projects-content">

                {icon && (
                    <div className="empty-projects-icon">
                        <FontAwesomeIcon icon={icon} />
                    </div>
                )}

                <h2 className="empty-projects-title">
                    {title}
                </h2>

                <p className="empty-projects-description">
                    {message}
                </p>

                {actionLabel && onAction && (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onAction}
                    >
                        {actionIcon && (
                            <FontAwesomeIcon icon={actionIcon} />
                        )}

                        {actionLabel}
                    </button>
                )}

            </div>
        </div>
    );
};

export default EmptyState;