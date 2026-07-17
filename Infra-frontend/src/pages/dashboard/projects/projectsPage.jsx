import DashboardLayout from "../../../layouts/DashboardLayout";

import ProjectHeader from "../../../components/projects/projectHeader";
import ProjectGrid from "../../../components/projects/projectGrid";

const ProjectsPage = () => {
    return (
        <>
            <div className="projects-page">
                <ProjectHeader />

                <ProjectGrid />
            </div>
        </>
    );
};

export default ProjectsPage;