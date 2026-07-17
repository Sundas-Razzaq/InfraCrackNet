import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import ProjectDetails from "../../../components/projects/projectDetails";
import DeleteProjectModal from "../../../components/projects/deleteProjectModal";

import {
    getProjectById,
    deleteProject,
} from "../../../api/projectApi";

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response =
                    await getProjectById(id);

                setProject(response.data);
            } catch (error) {
                console.error(
                    "Failed to fetch project:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);

            await deleteProject(project._id);

            navigate("/dashboard/projects");
        } catch (error) {
            console.error(
                "Failed to delete project:",
                error
            );
        } finally {
            setDeleteLoading(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <>
                <p>Loading project...</p>
            </>
        );
    }

    return (
        <>
            <ProjectDetails
                project={project}
                onDelete={() =>
                    setShowDeleteModal(true)
                }
            />

            <DeleteProjectModal
                isOpen={showDeleteModal}
                onClose={() =>
                    setShowDeleteModal(false)
                }
                onConfirm={handleDelete}
                loading={deleteLoading}
            />
        </>
    );
};

export default ProjectDetailsPage;