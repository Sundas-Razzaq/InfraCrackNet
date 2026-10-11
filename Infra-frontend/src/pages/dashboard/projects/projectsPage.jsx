import ProjectGrid from "../../../components/projects/projectGrid";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../../components/dashboard/shared/PageHeader";
import { useRole } from "../../../context/useRole";

const ProjectsPage = () => {
    const navigate = useNavigate();
    const { isEngineer } = useRole();

    return (
        <>
            <div className="projects-page">
                <PageHeader
                    title="Projects"
                    subtitle="Manage and organize infrastructure inspection projects."
                >
                    {isEngineer && (
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
                    )}
                </PageHeader>
                <ProjectGrid />
            </div>
        </>
    );
};

export default ProjectsPage;