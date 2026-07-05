import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

function ReminderWidget() {
    return (
        <aside
            className="reminder-banner"
            role="status"
            aria-live="polite"
        >
            <span
                className="reminder-icon"
                aria-hidden="true"
            >
                <FontAwesomeIcon icon={faTriangleExclamation} />
            </span>

            <div className="reminder-content">

                <h3 className="reminder-title">
                    Pending Upload Reminder
                </h3>

                <p className="reminder-message">
                    INS-2023 has 5 pending images. Upload before 5:00 PM today to complete the inspection record.
                </p>

            </div>
        </aside>
    );
}

export default ReminderWidget;