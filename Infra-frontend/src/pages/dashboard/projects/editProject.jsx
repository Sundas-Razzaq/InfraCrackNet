import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProjectForm from "../../../components/projects/projectForm";

import {
    getProjectById,
    updateProject,
} from "../../../api/projectApi";

const EditProjectPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response =
                    await getProjectById(id);

                setProject(response.data);
            }
            catch {
                toast.error(
                    "Failed to load project."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleUpdateProject = async (
        formData
    ) => {
        try {
            await updateProject(id, formData);

            toast.success(
                "Project updated successfully."
            );

            navigate(`/dashboard/projects/${id}`);
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update project."
            );
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading project...
            </div>
        );
    }

    if (!project) {
        return (
            <div className="page-loading">
                Project not found.
            </div>
        );
    }
    return (

        <div className="edit-project-page">

            <ProjectForm
                mode="edit"
                initialData={project}
                onSubmit={handleUpdateProject}
            />

        </div>

    );

};

export default EditProjectPage;