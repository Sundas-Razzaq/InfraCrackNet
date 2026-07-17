import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const ProjectCard = ({ project }) => {
    const getPriorityClass = (priority) => {
        switch (priority) {
            case "Critical":
                return "priority-critical";
            case "High":
                return "priority-high";
            case "Medium":
                return "priority-medium";
            case "Low":
                return "priority-low";
            default:
                return "";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Active":
                return "status-active";
            case "On Hold":
                return "status-hold";
            case "Completed":
                return "status-completed";
            default:
                return "";
        }
    };

    return (
        <Link
            to={`/dashboard/projects/${project._id}`}
            className="project-card"
        >
            <div className="project-card-header">
                <div className="project-card-title">
                    <p className="project-code">
                        {project.projectCode}
                    </p>

                    <h3 className="project-name">
                        {project.name}
                    </h3>
                </div>

                <span
                    className={`project-status ${getStatusClass(
                        project.status
                    )}`}
                >
                    {project.status}
                </span>
            </div>

            <p className="project-description">
                {project.description}
            </p>

            <div className="project-card-body">

                <div className="project-info">
                    <span className="label">
                        Structure
                    </span>

                    <span>
                        {project.structureType}
                    </span>
                </div>

                <div className="project-info project-location">

                    <FontAwesomeIcon
                        icon={faLocationDot}
                        className="location-icon"
                    />

                    <span>{project.location}</span>

                </div>

                <div className="project-info">
                    <span className="label">
                        Priority
                    </span>

                    <span
                        className={`project-priority ${getPriorityClass(
                            project.priority
                        )}`}
                    >
                        {project.priority}
                    </span>
                </div>

            </div>

            <div className="project-card-footer">

                <small className="project-author">
                    Created by{" "}
                    {project.createdBy?.name || "Unknown"}
                </small>

                <small className="project-date">
                    {new Date(
                        project.createdAt
                    ).toLocaleDateString()}
                </small>

            </div>
        </Link>
    );
};

export default ProjectCard;