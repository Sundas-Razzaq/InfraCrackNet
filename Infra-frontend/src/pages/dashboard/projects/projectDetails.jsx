import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import ProjectDetails from "../../../components/projects/projectDetails";

import { getApiErrorMessage } from "../../../api/authApi";
import { getProjectById } from "../../../api/projectApi";

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await getProjectById(id);
                setProject(response.data);
            } catch (error) {
                toast.error(getApiErrorMessage(error, "Failed to load project."));
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleStartInspection = () => {
        navigate("/dashboard/inspection/new", {
            state: { projectId: project._id },
        });
    };

    if (loading) {
        return <div className="page-loading">Loading project...</div>;
    }

    if (!project) {
        return <div className="page-loading">Project not found.</div>;
    }

    return (
        <ProjectDetails
            project={project}
            onStartInspection={handleStartInspection}
        />
    );
};

export default ProjectDetailsPage;