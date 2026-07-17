import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFolderOpen,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

const EmptyProjects = () => {
    const navigate = useNavigate();

    return (
        <div className="empty-projects">

            <div className="empty-projects-content">

                <div className="empty-projects-icon">

                    <FontAwesomeIcon
                        icon={faFolderOpen}
                    />

                </div>

                <h2 className="empty-projects-title">
                    No Projects Found
                </h2>

                <p className="empty-projects-description">
                    You haven't created any infrastructure inspection projects yet.
                    Create your first project to get started.
                </p>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate("/dashboard/projects/new")
                    }
                >
                    <FontAwesomeIcon
                        icon={faPlus}
                        className="btn-icon"
                    />

                    Create Project
                </button>

            </div>

        </div>
    );
};

export default EmptyProjects;