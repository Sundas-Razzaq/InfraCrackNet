import DashboardLayout from "../../layouts/DashboardLayout";
import "../../styles/notification.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faTriangleExclamation,
    faRobot,
    faCircleCheck,
    faClock,
    faUserPlus,
    faFileLines,
} from "@fortawesome/free-solid-svg-icons";

const notifications = [
    {
        id: 1,
        type: "critical",
        icon: faTriangleExclamation,
        title: "Critical Crack Detected — Immediate Action Required",
        message:
            "INS-2024 — North Bridge has 3 critical severity cracks. Immediate engineering review required before next use.",
        time: "2 min ago",
        unread: true,
    },
    {
        id: 2,
        type: "analysis",
        icon: faRobot,
        title: "AI Analysis Complete — INS-2023",
        message:
            "Highway M9 inspection has been successfully analyzed. 12 cracks detected with 94.7% confidence.",
        time: "15 min ago",
        unread: true,
    },
    {
        id: 3,
        type: "success",
        icon: faCircleCheck,
        title: "Report RPT-0086 Approved by Ahmed Hassan",
        message:
            "Highway M9 inspection report has been approved and is ready for client distribution.",
        time: "1 hour ago",
        unread: true,
    },
    {
        id: 4,
        type: "warning",
        icon: faClock,
        title: "Inspection Overdue — PRJ-004 Tarbela Dam",
        message:
            "Scheduled inspection for Tarbela Dam is 3 days overdue. Please schedule immediately.",
        time: "2 hours ago",
        unread: false,
    },
    {
        id: 5,
        type: "team",
        icon: faUserPlus,
        title: "New Team Member Added",
        message:
            "Khalid Yusuf has joined as Inspector on the North Bridge Rehabilitation project.",
        time: "Yesterday",
        unread: false,
    },
    {
        id: 6,
        type: "report",
        icon: faFileLines,
        title: "Report RPT-0085 Generated Successfully",
        message:
            "East Tunnel inspection report is ready for engineer review and approval.",
        time: "Yesterday",
        unread: false,
    },
];

const Notifications = () => {
    return (
        <>
            <div className="notifications-page">

                {/* Header */}

                <div className="notifications-header">

                    <div>
                        <h1 className="notifications-title">
                            Notifications
                        </h1>

                        <p className="notifications-subtitle">
                            3 unread notifications
                        </p>
                    </div>

                    <div className="notifications-actions">
                        <button className="btn-secondary">
                            Mark all read
                        </button>

                        <button className="btn-secondary">
                            Settings
                        </button>
                    </div>

                </div>

                {/* Tabs */}

                <div className="notification-tabs">

                    <button className="notification-tab active">
                        All (6)
                    </button>

                    <button className="notification-tab">
                        Unread (3)
                    </button>

                    <button className="notification-tab">
                        Critical (1)
                    </button>

                    <button className="notification-tab">
                        Reports (2)
                    </button>

                </div>

                {/* List */}

                <div className="notification-list card">

                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`notification-item ${notification.type}`}
                        >
                            <div className="notification-icon">
                                <FontAwesomeIcon icon={notification.icon} />
                            </div>

                            <div className="notification-content">

                                <div className="notification-top">

                                    <h3 className="notification-title">
                                        {notification.title}
                                    </h3>

                                    <span className="notification-time">
                                        {notification.time}
                                    </span>

                                </div>

                                <div className="notification-bottom">

                                    <p className="notification-message">
                                        {notification.message}
                                    </p>

                                    {notification.unread && (
                                        <span className="notification-dot"></span>
                                    )}

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </>
    );
};

export default Notifications;