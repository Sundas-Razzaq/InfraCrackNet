import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import AdminProjectForm from "../../../components/admin/projects/AdminProjectForm";

import { createAdminProject, getAdminProject, updateAdminProject } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";

const AdminProjectFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (!id) return undefined;

        let cancelled = false;

        const run = async () => {
            try {
                const res = await getAdminProject(id);
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
    }, [id]);

    const backTo = isEdit ? `/dashboard/admin/projects/${id}` : "/dashboard/admin/projects";

    const handleSubmit = async (payload) => {
        try {
            const res = isEdit
                ? await updateAdminProject(id, payload)
                : await createAdminProject(payload);

            toast.success(res.message);
            navigate(`/dashboard/admin/projects/${res.data._id}`);
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

            <AdminProjectForm
                mode={isEdit ? "edit" : "create"}
                initialData={project || {}}
                onSubmit={handleSubmit}
                onCancel={() => navigate(backTo)}
            />
        </div>
    );
};

export default AdminProjectFormPage;