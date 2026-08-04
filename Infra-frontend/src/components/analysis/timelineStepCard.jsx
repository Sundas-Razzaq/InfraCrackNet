import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faSpinner,
    faCircle,
} from "@fortawesome/free-solid-svg-icons";

const timelineStepCard = ({
    title,
    description,
    completed = false,
    active = false,
}) => {
    const icon = completed
        ? faCircleCheck
        : active
            ? faSpinner
            : faCircle;

    return (
        <div
            className={`analysis-progress-card ${completed
                ? "completed"
                : active
                    ? "active"
                    : ""
                }`}
        >
            <div className="analysis-progress-icon">
                <FontAwesomeIcon
                    icon={icon}
                    spin={active}
                />
            </div>

            <div className="analysis-progress-content">
                <h4>{title}</h4>

                <p>{description}</p>
            </div>

            <div className="analysis-progress-status">
                {completed
                    ? "Completed"
                    : active
                        ? "Processing"
                        : "Pending"}
            </div>
        </div>
    );
};

export default timelineStepCard;