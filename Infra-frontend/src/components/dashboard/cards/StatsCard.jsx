import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function StatsCard({ title, value, description, icon, iconVariant = "primary", onClick }) {
    const classes = ["stat-card", onClick ? "is-clickable" : ""].filter(Boolean).join(" ");
    const content = (
        <>
            <div className="stat-card-content">
                <h3 className="stat-card-title">{title}</h3>
                <div className="stat-card-value">{value}</div>
                <p className="stat-card-description">{description}</p>
            </div>

            <div className={["stat-card-icon", iconVariant].filter(Boolean).join(" ")} aria-hidden="true">
                <FontAwesomeIcon icon={icon} />
            </div>
        </>
    );

    if (onClick) {
        return (
            <button type="button" className={classes} onClick={onClick}>
                {content}
            </button>
        );
    }

    return <article className={classes}>{content}</article>;
}

export default StatsCard;
