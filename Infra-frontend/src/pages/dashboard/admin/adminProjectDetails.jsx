import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import ProjectDetails from "../../../components/projects/projectDetails";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import AssignTeamModal from "../../../components/admin/projects/AssignTeamModal";

import {
    deleteAdminProject,
    getAdminProject,
    unassignProjectTeam,
} from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";

const AdminProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [footprint, setFootprint] = useState(null);
    const [teamInspectors, setTeamInspectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    // null | "assign" | "unassign" | "delete"
    const [modal, setModal] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                const res = await getAdminProject(id);
                if (cancelled) return;
                setProject(res.data);
                setFootprint(res.footprint || null);
                setTeamInspectors(res.teamInspectors || []);
                setError("");
            } catch (err) {
                if (!cancelled) setError(getApiErrorMessage(err, "Failed to load project."));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [id, reloadKey]);

    const reload = () => setReloadKey((key) => key + 1);

    const handleUnassign = async () => {
        setBusy(true);

        try {
            const res = await unassignProjectTeam(project._id);
            toast.success(res.message);
            reload();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to unassign team."));
        } finally {
            setBusy(false);
            setModal(null);
        }
    };

    const handleDelete = async () => {
        setBusy(true);

        try {
            const res = await deleteAdminProject(project._id, project.projectCode);
            toast.success(res.message);

            if (res.cloudinaryFailures?.length > 0) {
                toast.warning(
                    `${res.cloudinaryFailures.length} media file(s) could not be removed from storage.`
                );
            }

            navigate("/dashboard/admin/projects", { replace: true });
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to delete project."));
            setModal(null);
        } finally {
            setBusy(false);
        }
    };

    if (loading) return <div className="page-loading">Loading project...</div>;
    if (error || !project) return <div className="page-loading">{error || "Project not found."}</div>;

    return (
        <>
            <ProjectDetails
                project={project}
                teamInspectors={teamInspectors}
                footprint={footprint}
                onAssign={() => setModal("assign")}
                onUnassign={() => setModal("unassign")}
                onDelete={() => setModal("delete")}
            />

            {modal === "assign" && (
                <AssignTeamModal
                    project={project}
                    onClose={() => setModal(null)}
                    onAssigned={() => {
                        setModal(null);
                        reload();
                    }}
                />
            )}

            <ConfirmModal
                isOpen={modal === "unassign"}
                title="Unassign this project?"
                description={`${project.name} will no longer be visible to ${project.team?.name || "the team"}.`}
                warning="Blocked while an analysis is running."
                confirmText="Unassign"
                loading={busy}
                onClose={() => setModal(null)}
                onConfirm={handleUnassign}
            />

            <ConfirmModal
                isOpen={modal === "delete"}
                danger
                title="Delete this project?"
                description={
                    footprint
                        ? `This permanently deletes ${footprint.inspections} inspection(s), ${footprint.images} media file(s), ${footprint.analyses} analysis/analyses and ${footprint.reports} report(s).`
                        : "This permanently deletes the project and everything linked to it."
                }
                warning="This cannot be undone. Blocked while an analysis is running."
                requireText={project.projectCode}
                confirmText="Delete Project"
                loading={busy}
                onClose={() => setModal(null)}
                onConfirm={handleDelete}
            />
        </>
    );
};

export default AdminProjectDetailsPage;