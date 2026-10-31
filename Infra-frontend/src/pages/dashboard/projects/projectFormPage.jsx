import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import ProjectForm from "../../../components/projects/projectForm";

import {
    createAdminProject,
    getAdminProject,
    updateAdminProject,
} from "../../../api/adminApi";
import { getProjectById, updateProject } from "../../../api/projectApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { useRole } from "../../../utils/useRole";

// One page for: Admin create, Admin edit, Engineer edit.
const ProjectFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useRole();
    const isEdit = Boolean(id);

    const basePath = isAdmin ? "/dashboard/admin/projects" : "/dashboard/projects";

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (!id) return undefined;

        let cancelled = false;

        const run = async () => {
            try {
                const res = await (isAdmin ? getAdminProject(id) : getProjectById(id));
                if (!cancelled) setProject(res.data);
            } catch (err) {
                if (!cancelled) toast.error(getApiErrorMessage(err, "Failed to load project."));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [id, isAdmin]);

    const backTo = isEdit ? `${basePath}/${id}` : basePath;

    const handleSubmit = async (payload) => {
        try {
            let res;

            if (!isEdit) res = await createAdminProject(payload);
            else if (isAdmin) res = await updateAdminProject(id, payload);
            else res = await updateProject(id, payload);

            toast.success(res.message);
            navigate(`${basePath}/${res.data._id}`);
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to save project."));
        }
    };

    if (loading) return <div className="page-loading">Loading project...</div>;
    if (isEdit && !project) return <div className="page-loading">Project not found.</div>;

    return (
        <div className="adm-page">
            <Link to={backTo} className="dtl-back">
                <FontAwesomeIcon icon={faChevronLeft} />
                {isEdit ? "Back to project" : "All projects"}
            </Link>

            <PageHeader
                title={isEdit ? "Edit Project" : "New Project"}
                subtitle={
                    isEdit
                        ? `${project.projectCode} · ${project.name}`
                        : "Create an infrastructure inspection project."
                }
            />

            <ProjectForm
                mode={isEdit ? "edit" : "create"}
                initialData={project || {}}
                onSubmit={handleSubmit}
                onCancel={() => navigate(backTo)}
            />
        </div>
    );
};

export default ProjectFormPage;