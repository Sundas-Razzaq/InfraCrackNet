import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faCubes,
    faLocationDot,
    faPen,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import { Button, Card, Chip, Fact, Row } from "../../../components/dashboard/shared/DetailsKit";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import StatusChip from "../../../components/admin/StatusChip";
import AssignTeamModal from "../../../components/admin/projects/AssignTeamModal";

import {
    deleteAdminProject,
    getAdminProject,
    unassignProjectTeam,
} from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { formatDate } from "../../../utils/adminFormat";

const AdminProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [footprint, setFootprint] = useState(null);
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

    const team = project.team;

    return (
        <div className="dtl">
            <Link to="/dashboard/admin/projects" className="dtl-back">
                <FontAwesomeIcon icon={faChevronLeft} />
                All projects
            </Link>

            <header className="dtl-header">
                <div className="dtl-heading">
                    <h1 className="dtl-title">{project.name}</h1>

                    <div className="dtl-heading-meta">
                        <span className="dtl-code">{project.projectCode}</span>
                        <StatusChip value={project.status} />
                        <StatusChip value={project.priority} />
                    </div>
                </div>

                <div className="dtl-toolbar">
                    <Button icon={faPen} onClick={() => navigate(`/dashboard/admin/projects/${project._id}/edit`)}>
                        Edit Project
                    </Button>

                    <span className="dtl-toolbar-sep" aria-hidden="true" />

                    <Button variant="danger" icon={faTrashCan} onClick={() => setModal("delete")}>
                        Delete Project
                    </Button>
                </div>
            </header>

            <div className="dtl-layout">
                <div className="dtl-main">
                    <Card title="Overview">
                        <p className={`dtl-prose ${project.description ? "" : "dtl-prose--empty"}`}>
                            {project.description || "No description added."}
                        </p>

                        <dl className="dtl-facts dtl-facts--2">
                            <Fact label="Structure type" icon={faCubes}>{project.structureType}</Fact>
                            <Fact label="Location" icon={faLocationDot}>{project.location}</Fact>
                        </dl>
                    </Card>

                    <Card title="Assigned team">
                        {team ? (
                            <dl className="dtl-rows">
                                <Row label="Team">
                                    <Link to={`/dashboard/admin/teams/${team._id}`} className="dtl-link">
                                        {team.name}
                                    </Link>
                                </Row>
                                <Row label="Team status"><StatusChip value={team.status} /></Row>
                                <Row label="Engineer lead">{team.engineerLead?.name}</Row>
                                <Row label="Assigned on">{formatDate(project.assignedAt)}</Row>
                                <Row label="Assigned by">{project.assignedBy?.name}</Row>
                            </dl>
                        ) : (
                            <>
                                <Chip tone="warning">Unassigned</Chip>
                                <p className="dtl-prose dtl-prose--empty">
                                    This project is outside the team workflow. Engineers and Inspectors cannot
                                    see it until a team is assigned.
                                </p>
                            </>
                        )}

                        <div className="adm-card-actions">
                            <Button variant="primary" onClick={() => setModal("assign")}>
                                {team ? "Reassign team" : "Assign team"}
                            </Button>

                            {team && (
                                <Button variant="secondary" onClick={() => setModal("unassign")}>
                                    Unassign
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>

                <aside className="dtl-side">
                    {footprint && (
                        <Card title="Progress">
                            <dl className="dtl-rows">
                                <Row label="Inspections">{String(footprint.inspections)}</Row>
                                <Row label="Images / media">{String(footprint.images)}</Row>
                                <Row label="AI analyses">{String(footprint.analyses)}</Row>
                                <Row label="Reports">{String(footprint.reports)}</Row>
                            </dl>
                        </Card>
                    )}

                    <Card title="Project record">
                        <dl className="dtl-rows">
                            <Row label="Created by">{project.createdBy?.name}</Row>
                            <Row label="Created on">{formatDate(project.createdAt)}</Row>
                            <Row label="Last updated">{formatDate(project.updatedAt)}</Row>
                        </dl>
                        <Link
                            to={`/dashboard/admin/activity-log?targetType=Project&targetId=${project._id}`}
                            className="dtl-link"
                        >
                            View activity
                        </Link>
                    </Card>
                </aside>
            </div>

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
                description={`${project.name} will no longer be visible to ${team?.name || "the team"}.`}
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
        </div>
    );
};

export default AdminProjectDetailsPage;