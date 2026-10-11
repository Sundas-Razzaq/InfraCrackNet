import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
    faCalendarDays,
    faUserTie,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { useRole } from "../../utils/useRole";

const ProjectDetails = ({ project, onDelete, onStartInspection }) => {
    const navigate = useNavigate();
    const { isEngineer, isInspector } = useRole();

    if (!project) {
        return (
            <div className="project-details-empty">
                Project not found.
            </div>
        );
    }

    return (
        <div className="project-details">

            <div className="project-details-header">

                <div className="project-details-title">

                    <h1 className="project-name">
                        {project.name}
                    </h1>

                    <p className="project-code">
                        {project.projectCode}
                    </p>

                </div>

                <div className="project-actions">

                    {/* Start Inspection is Inspector-only */}
                    {isInspector && (
                        <button
                            className="btn btn-primary"
                            onClick={onStartInspection}
                        >
                            <FontAwesomeIcon
                                icon={faPlay}
                                className="project-btn-icon"
                            />
                            Start Inspection
                        </button>
                    )}

                    {/* Edit Project is Engineer-only */}
                    {isEngineer && (
                        <button
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(
                                    `/dashboard/projects/${project._id}/edit`
                                )
                            }
                        >
                            Edit Project
                        </button>
                    )}

                    {/* Delete Project is Engineer-only */}
                    {isEngineer && (
                        <button
                            className="btn btn-danger"
                            onClick={onDelete}
                        >
                            Delete Project
                        </button>
                    )}

                </div>

            </div>

            <div className="project-details-card">

                <div className="project-details-grid">

                    <div className="project-detail">
                        <label>Description</label>
                        <p>{project.description}</p>
                    </div>

                    <div className="project-detail">
                        <label>Structure Type</label>
                        <p>{project.structureType}</p>
                    </div>

                    <div className="project-detail">
                        <label>Location</label>
                        <p className="project-meta">
                            <FontAwesomeIcon
                                icon={faLocationDot}
                                className="detail-icon"
                            />
                            {project.location}
                        </p>
                    </div>

                    <div className="project-detail">
                        <label>Priority</label>
                        <p>{project.priority}</p>
                    </div>

                    <div className="project-detail">
                        <label>Status</label>
                        <p>{project.status}</p>
                    </div>

                    <div className="project-detail">
                        <label>Created By</label>
                        <p className="project-meta">
                            <FontAwesomeIcon
                                icon={faUserTie}
                                className="detail-icon"
                            />
                            {project.createdBy?.name}
                        </p>
                    </div>

                    <div className="project-detail">
                        <label>Created On</label>
                        <p className="project-meta">
                            <FontAwesomeIcon
                                icon={faCalendarDays}
                                className="detail-icon"
                            />
                            {new Date(
                                project.createdAt
                            ).toLocaleDateString()}
                        </p>
                    </div>

                </div>

                {/* Inspectors section — outside the grid, inside the card */}
                {project.assignedInspectors &&
                    project.assignedInspectors.length > 0 && (
                        <div className="project-inspectors-section">
                            <h3 className="project-inspectors-title">
                                Assigned Inspectors
                            </h3>

                            <ul className="project-inspectors-list">
                                {project.assignedInspectors.map((inspector) => (
                                    <li
                                        key={
                                            typeof inspector === "string"
                                                ? inspector
                                                : inspector._id
                                        }
                                        className="project-inspector-item"
                                    >
                                        <FontAwesomeIcon
                                            icon={faUserTie}
                                            className="detail-icon"
                                        />

                                        <div className="project-inspector-info">
                                            <span className="project-inspector-name">
                                                {inspector.name ||
                                                    "Unknown inspector"}
                                            </span>

                                            {inspector.email && (
                                                <span className="project-inspector-email">
                                                    {inspector.email}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

            </div>

        </div>
    );
};

export default ProjectDetails;