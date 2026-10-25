import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faChevronLeft, faPen, faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";

import { Button, Card, Chip, Row } from "../../../components/dashboard/shared/DetailsKit";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import Person from "../../../components/admin/Person";
import StatusChip from "../../../components/admin/StatusChip";
import TeamFormModal from "../../../components/admin/teams/TeamFormModal";
import LeadModal from "../../../components/admin/teams/LeadModal";
import AddInspectorModal from "../../../components/admin/teams/AddInspectorModal";
import RemoveMemberModal from "../../../components/admin/teams/RemoveMemberModal";

import { getTeamById, updateTeamStatus } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { formatDate } from "../../../utils/adminFormat";

const AdminTeamDetailsPage = () => {
    const { id } = useParams();

    const [team, setTeam] = useState(null);
    const [inspectors, setInspectors] = useState([]);
    const [readiness, setReadiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    // null | "edit" | "lead" | "addInspector" | "deactivate"
    const [modal, setModal] = useState(null);
    const [removeTarget, setRemoveTarget] = useState(null);
    const [statusSaving, setStatusSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                const res = await getTeamById(id);
                if (cancelled) return;
                setTeam(res.data);
                setInspectors(res.inspectors || []);
                setReadiness(res.readiness || null);
                setError("");
            } catch (err) {
                if (!cancelled) setError(getApiErrorMessage(err, "Failed to load team."));
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

    const closeAndReload = () => {
        setModal(null);
        setRemoveTarget(null);
        reload();
    };

    const changeStatus = async (status) => {
        setStatusSaving(true);

        try {
            const res = await updateTeamStatus(team._id, { status });
            toast.success(res.message);
            reload();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update team status."));
        } finally {
            setStatusSaving(false);
            setModal(null);
        }
    };

    if (loading) return <div className="page-loading">Loading team...</div>;
    if (error || !team) return <div className="page-loading">{error || "Team not found."}</div>;

    const lead = team.engineerLead;
    const isActive = team.status === "Active";

    return (
        <div className="dtl">
            <Link to="/dashboard/admin/teams" className="dtl-back">
                <FontAwesomeIcon icon={faChevronLeft} />
                All teams
            </Link>

            <header className="dtl-header">
                <div className="dtl-heading">
                    <h1 className="dtl-title">{team.name}</h1>
                    <div className="dtl-heading-meta">
                        <StatusChip value={team.status} />
                    </div>
                </div>

                <div className="dtl-toolbar">
                    <Button icon={faPen} onClick={() => setModal("edit")}>
                        Edit Team
                    </Button>

                    {isActive ? (
                        <Button variant="danger" icon={faBan} onClick={() => setModal("deactivate")} disabled={statusSaving}>
                            Deactivate
                        </Button>
                    ) : (
                        <Button variant="primary" icon={faPlay} onClick={() => changeStatus("Active")} disabled={statusSaving}>
                            Activate
                        </Button>
                    )}
                </div>
            </header>

            <div className="dtl-layout">
                <div className="dtl-main">
                    <Card title="Overview">
                        <p className={`dtl-prose ${team.description ? "" : "dtl-prose--empty"}`}>
                            {team.description || "No description added."}
                        </p>
                    </Card>

                    <Card title="Engineer lead">
                        {lead ? (
                            <ul className="dtl-people">
                                <Person name={lead.name} sub={lead.email}>
                                    {lead.isActive === false && <Chip tone="neutral">Inactive</Chip>}
                                </Person>
                            </ul>
                        ) : (
                            <p className="dtl-prose dtl-prose--empty">No lead assigned yet.</p>
                        )}

                        <div className="adm-card-actions">
                            <Button variant={lead ? "secondary" : "primary"} onClick={() => setModal("lead")}>
                                {lead ? "Replace lead" : "Assign lead"}
                            </Button>
                        </div>
                    </Card>

                    <Card title={`Inspectors (${inspectors.length})`}>
                        {inspectors.length === 0 ? (
                            <p className="dtl-prose dtl-prose--empty">No inspectors in this team yet.</p>
                        ) : (
                            <ul className="dtl-people">
                                {inspectors.map((inspector) => (
                                    <Person key={inspector._id} name={inspector.name} sub={inspector.email}>
                                        <button
                                            type="button"
                                            className="btn-outline btn-sm"
                                            onClick={() => setRemoveTarget(inspector)}
                                        >
                                            Remove
                                        </button>
                                    </Person>
                                ))}
                            </ul>
                        )}

                        <div className="adm-card-actions">
                            <Button variant="primary" icon={faPlus} onClick={() => setModal("addInspector")}>
                                Add inspector
                            </Button>
                        </div>
                    </Card>
                </div>

                <aside className="dtl-side">
                    {readiness && (
                        <Card title="Readiness">
                            <dl className="dtl-rows">
                                <Row label="Can be activated">
                                    <Chip tone={readiness.canActivate ? "success" : "warning"}>
                                        {readiness.canActivate ? "Yes" : "Not yet"}
                                    </Chip>
                                </Row>
                            </dl>

                            {readiness.missing.map((text) => (
                                <p key={text} className="form-error">Missing: {text}</p>
                            ))}

                            {readiness.warnings.map((text) => (
                                <p key={text} className="form-hint">{text}</p>
                            ))}
                        </Card>
                    )}

                    <Card title="Team record">
                        <dl className="dtl-rows">
                            <Row label="Created">{formatDate(team.createdAt)}</Row>
                            <Row label="Last updated">{formatDate(team.updatedAt)}</Row>
                        </dl>
                    </Card>
                </aside>
            </div>

            {modal === "edit" && <TeamFormModal team={team} onClose={() => setModal(null)} onSaved={closeAndReload} />}
            {modal === "lead" && <LeadModal team={team} onClose={() => setModal(null)} onChanged={closeAndReload} />}
            {modal === "addInspector" && (
                <AddInspectorModal team={team} onClose={() => setModal(null)} onAdded={closeAndReload} />
            )}
            {removeTarget && (
                <RemoveMemberModal
                    team={team}
                    member={removeTarget}
                    onClose={() => setRemoveTarget(null)}
                    onRemoved={closeAndReload}
                />
            )}

            <ConfirmModal
                isOpen={modal === "deactivate"}
                danger
                title="Deactivate this team?"
                description={`${team.name} will become inactive. Teams with open projects cannot be deactivated.`}
                confirmText="Deactivate"
                loading={statusSaving}
                onClose={() => setModal(null)}
                onConfirm={() => changeStatus("Inactive")}
            />
        </div>
    );
};

export default AdminTeamDetailsPage;