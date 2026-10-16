import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTriangleExclamation,
    faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { slideLeft } from "../../../../utils/animation";

function ReminderWidget({ inspections = [] }) {
    const navigate = useNavigate();

    const { draftsWithoutImages, uploadedNotRequested, total } =
        useMemo(() => {
            const drafts = inspections.filter(
                (i) => i.status === "Draft"
            );

            const uploaded = inspections.filter(
                (i) => i.status === "Images Uploaded"
            );

            return {
                draftsWithoutImages: drafts,
                uploadedNotRequested: uploaded,
                total: drafts.length + uploaded.length,
            };
        }, [inspections]);

    // Nothing pending — show all-caught-up state
    if (total === 0) {
        return (
            <motion.aside
                className="reminder-banner reminder-banner-success"
                role="status"
                aria-live="polite"
                variants={slideLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <span className="reminder-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faCircleCheck} />
                </span>

                <div className="reminder-content">
                    <h3 className="reminder-title">
                        All Caught Up
                    </h3>
                    <p className="reminder-message">
                        No pending inspections require your
                        attention. Your work is up to date.
                    </p>
                </div>
            </motion.aside>
        );
    }

    // Build a per-inspection bullet list
    const lines = [];

    draftsWithoutImages.slice(0, 3).forEach((ins) => {
        lines.push(
            `${ins.inspectionCode} is a draft with no images uploaded.`
        );
    });

    uploadedNotRequested.slice(0, 3).forEach((ins) => {
        lines.push(
            `${ins.inspectionCode} has images uploaded but analysis hasn't been requested yet.`
        );
    });

    const remaining =
        draftsWithoutImages.length +
        uploadedNotRequested.length -
        lines.length;

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
            <span className="reminder-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faTriangleExclamation} />
            </span>

            <div className="reminder-content">
                <h3 className="reminder-title">
                    Pending Inspections Reminder
                </h3>

                <p className="reminder-message">
                    You have{" "}
                    <strong>
                        {total} inspection
                        {total !== 1 ? "s" : ""}
                    </strong>{" "}
                    that need{total === 1 ? "s" : ""} attention.
                </p>

                <ul className="reminder-list">
                    {lines.map((line, idx) => (
                        <li key={idx}>{line}</li>
                    ))}

                    {remaining > 0 && (
                        <li className="reminder-more">
                            …and {remaining} more.
                        </li>
                    )}
                </ul>

                <div className="reminder-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate(
                                "/dashboard/inspection/drafts"
                            )
                        }
                    >
                        View Drafts
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            const first =
                                draftsWithoutImages[0] ||
                                uploadedNotRequested[0];

                            if (first) {
                                navigate(
                                    `/dashboard/inspection/${first._id}/upload-images`
                                );
                            }
                        }}
                    >
                        Continue First
                    </button>
                </div>
            </div>
        </motion.aside>
    );
}

export default ReminderWidget;