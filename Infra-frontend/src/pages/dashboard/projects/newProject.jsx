import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../api/authApi";

import DashboardLayout from "../../../layouts/DashboardLayout";
import ProjectForm from "../../../components/projects/projectForm";
import { createProject } from "../../../api/projectApi";

const NewProjectPage = () => {
    const navigate = useNavigate();

    const handleCreateProject = async (formData) => {
        try {
            await createProject(formData);

            toast.success("Project created successfully.");

            navigate("/dashboard/projects");
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to create project."
                )
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