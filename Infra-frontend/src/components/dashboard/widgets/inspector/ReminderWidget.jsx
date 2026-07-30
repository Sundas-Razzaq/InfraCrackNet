import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { slideLeft } from "../../../../utils/animation";

function ReminderWidget() {
    return (
        <motion.aside
            className="reminder-banner"
            role="status"
            aria-live="polite"
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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
        </motion.aside>
    );
}

export default ReminderWidget;