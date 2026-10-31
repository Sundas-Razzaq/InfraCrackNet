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
    const [teamInspectors, setTeamInspectors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                const response = await getProjectById(id);
                if (cancelled) return;
                setProject(response.data);
                setTeamInspectors(response.teamInspectors || []);
            } catch (error) {
                if (!cancelled) {
                    toast.error(getApiErrorMessage(error, "Failed to load project."));
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleStartInspection = () => {
        navigate("/dashboard/inspection/new", {
            state: { projectId: project._id },
        });
    };

    if (loading) return <div className="page-loading">Loading project...</div>;
    if (!project) return <div className="page-loading">Project not found.</div>;

    return (
        <ProjectDetails
            project={project}
            teamInspectors={teamInspectors}
            onStartInspection={handleStartInspection}
        />
    );
};

export default ProjectDetailsPage;