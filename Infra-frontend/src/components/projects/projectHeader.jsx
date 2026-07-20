import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const ProjectHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="projects-header">

            <div className="projects-header-content">

                <h1 className="projects-title">
                    Projects
                </h1>

                <p className="projects-subtitle">
                    Manage and organize infrastructure inspection projects.
                </p>

            </div>

            <div className="projects-header-actions">

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate("/dashboard/projects/new")
                    }
                >
                    <FontAwesomeIcon
                        icon={faPlus}
                        className="project-btn-icon"
                    />

                    New Project
                </button>

            </div>

        </div>
    );
};

export default ProjectHeader;