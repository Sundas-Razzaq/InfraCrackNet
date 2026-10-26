import { useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

import AdminModal from "../AdminModal";
import { assignProjectTeam } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { useTeamOptions } from "../../../utils/useTeamOptions";

const ASSIGNABLE_TEAMS = { status: "Active", hasLead: true };

const AssignTeamModal = ({ project, onClose, onAssigned }) => {
    const currentTeamId = project.team?._id;
    const isReassign = Boolean(currentTeamId);

    const { teams, loading, error } = useTeamOptions(ASSIGNABLE_TEAMS);
    const [selectedId, setSelectedId] = useState("");
    const [saving, setSaving] = useState(false);

    const options = teams.filter((team) => team._id !== currentTeamId);

    const handleSave = async () => {
        if (!selectedId) return;

        setSaving(true);

        try {
            const res = await assignProjectTeam(project._id, { teamId: selectedId });
            toast.success(res.message);
            onAssigned();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to assign team."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminModal
            isOpen
            title={isReassign ? "Reassign Team" : "Assign Team"}
            subtitle={`${project.projectCode} · ${project.name}`}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
                        Cancel
                    </button>
                    <button type="button" className="btn-primary" onClick={handleSave} disabled={!selectedId || saving}>
                        {saving ? "Saving..." : isReassign ? "Reassign Project" : "Assign Project"}
                    </button>
                </>
            }
        >
            <div className="adm-stack">
                {isReassign && (
                    <div className="adm-banner">
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                        <span>
                            Reassigning moves the project away from <strong>{project.team.name}</strong>. Both
                            teams are notified, and this is blocked while an analysis is running.
                        </span>
                    </div>
                )}

                {loading && <p className="adm-table-state">Loading teams...</p>}
                {!loading && error && <p className="form-error">{error}</p>}

                {!loading && !error && options.length === 0 && (
                    <p className="adm-table-state">
                        No other active team with an Engineer lead is available.
                    </p>
                )}

                {!loading && !error && options.length > 0 && (
                    <ul className="adm-picker">
                        {options.map((team) => (
                            <li key={team._id}>
                                <button
                                    type="button"
                                    className={`adm-picker-item ${selectedId === team._id ? "selected" : ""}`}
                                    onClick={() => setSelectedId(team._id)}
                                >
                                    <span className="dtl-person-info">
                                        <span className="dtl-person-name">{team.name}</span>
                                        <span className="dtl-person-sub">
                                            Lead: {team.engineerLead?.name || "-"} ·{" "}
                                            {team.memberCounts?.inspectors ?? 0} inspector(s)
                                        </span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AdminModal>
    );
};

export default AssignTeamModal;