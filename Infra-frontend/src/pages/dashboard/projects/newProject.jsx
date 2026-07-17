import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import ProjectForm from "../../../components/projects/projectForm";

import { createProject } from "../../../api/projectApi";

const NewProjectPage = () => {
    const navigate = useNavigate();

    const handleCreateProject = async (formData) => {
        try {
            await createProject(formData);

            navigate("/dashboard/projects");
        } catch (error) {
            console.error(
                "Failed to create project:",
                error
            );
        }
    };

    return (
        <>
            <div className="new-project-page">
                <ProjectForm
                    mode="create"
                    onSubmit={handleCreateProject}
                />
            </div>
        </>
    );
};

export default NewProjectPage;