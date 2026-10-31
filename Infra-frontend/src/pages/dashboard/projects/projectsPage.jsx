import ProjectGrid from "../../../components/projects/projectGrid";
import PageHeader from "../../../components/dashboard/shared/PageHeader";

const ProjectsPage = () => {
    return (
        <div className="projects-page">
            <PageHeader
                title="Projects"
                subtitle="Infrastructure inspection projects assigned to your team."
            />
            <ProjectGrid />
        </div>
    );
};

export default ProjectsPage;