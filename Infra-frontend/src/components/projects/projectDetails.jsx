import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
    faCalendarDays,
    faUserTie,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";

const ProjectDetails = ({ project, onDelete, onStartInspection }) => {
    const navigate = useNavigate();

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

                    <button
                        className="btn btn-danger"
                        onClick={onDelete}
                    >
                        Delete Project
                    </button>

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

            </div>

        </div>
    );
};

export default ProjectDetails;