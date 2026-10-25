import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import AdminModal from "../AdminModal";
import ConfirmModal from "../ConfirmModal";
import StatusChip from "../StatusChip";
import { Button, Card, Row } from "../../dashboard/shared/DetailsKit";

import { getManagedUser, updateUserRole, updateUserStatus } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { formatDate } from "../../../utils/adminFormat";

const UserDetailsModal = ({ userId, onClose, onChanged }) => {
    const [user, setUser] = useState(null);
    const [workload, setWorkload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [role, setRole] = useState("");
    const [reason, setReason] = useState("");
    const [saving, setSaving] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const res = await getManagedUser(userId);
                if (cancelled) return;
                setUser(res.data);
                setWorkload(res.workload);
                setRole(res.data.role);
            } catch (err) {
                if (!cancelled) setError(getApiErrorMessage(err, "Failed to load user."));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [userId]);

    // The update endpoints return the user without the populated team.
    const applyUpdate = (updated) => setUser((prev) => ({ ...updated, team: prev?.team ?? null }));

    const handleRoleSave = async () => {
        setSaving(true);
        try {
            const res = await updateUserRole(user._id, { role });
            toast.success(res.message);
            applyUpdate(res.data);
            onChanged();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update role."));
        } finally {
            setSaving(false);
        }
    };

    const changeStatus = async (isActive) => {
        setSaving(true);
        try {
            const res = await updateUserStatus(user._id, { isActive, reason: reason.trim() });
            toast.success(res.message);
            applyUpdate(res.data);
            setReason("");
            setConfirmOpen(false);
            onChanged();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update status."));
            setConfirmOpen(false);
        } finally {
            setSaving(false);
        }
    };

    const active = user ? user.isActive !== false : false;
    const isAdminAccount = user?.role === "Admin";

    return (
        <>
            <AdminModal
                isOpen
                wide
                title={user?.name || "User"}
                subtitle={user?.email}
                onClose={onClose}
                footer={
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                }
            >
                {loading && <p className="adm-table-state">Loading...</p>}
                {!loading && error && <p className="form-error">{error}</p>}

                {user && (
                    <div className="adm-stack">
                        <Card title="Profile">
                            <dl className="dtl-rows">
                                <Row label="Role"><StatusChip value={user.role} /></Row>
                                <Row label="Status"><StatusChip value={active ? "Active" : "Inactive"} /></Row>
                                <Row label="Team">{user.team?.name}</Row>
                                <Row label="Email verified">{user.isVerified ? "Yes" : "No"}</Row>
                                <Row label="Organization">{user.organization}</Row>
                                <Row label="Position">{user.position}</Row>
                                <Row label="Phone">{user.phone}</Row>
                                <Row label="Joined">{formatDate(user.createdAt)}</Row>
                            </dl>
                        </Card>

                        {workload && (
                            <Card title="Workload">
                                <dl className="dtl-rows">
                                    <Row label="Projects created">{String(workload.projectsCreated)}</Row>
                                    <Row label="Inspections">{String(workload.inspections)}</Row>
                                    <Row label="Analyses">{String(workload.analyses)}</Row>
                                    <Row label="Validations">{String(workload.validations)}</Row>
                                    <Row label="Reports">{String(workload.reports)}</Row>
                                </dl>
                            </Card>
                        )}

                        {isAdminAccount ? (
                            <p className="form-hint">The Admin account role and status cannot be changed.</p>
                        ) : (
                            <>
                                <Card title="Change role">
                                    <div className="adm-inline">
                                        <select
                                            className="input"
                                            value={role}
                                            onChange={(event) => setRole(event.target.value)}
                                        >
                                            <option value="Inspector">Inspector</option>
                                            <option value="Engineer">Engineer</option>
                                        </select>
                                        <Button
                                            variant="primary"
                                            onClick={handleRoleSave}
                                            disabled={saving || role === user.role}
                                        >
                                            Update role
                                        </Button>
                                    </div>
                                    <p className="form-hint">
                                        Allowed only when the user is not in a team and has no projects,
                                        inspections, analyses or reports.
                                    </p>
                                </Card>

                                <Card title="Account status">
                                    {active ? (
                                        <div className="adm-inline">
                                            <input
                                                className="input"
                                                placeholder="Reason (optional)"
                                                maxLength={300}
                                                value={reason}
                                                onChange={(event) => setReason(event.target.value)}
                                            />
                                            <Button
                                                variant="danger"
                                                onClick={() => setConfirmOpen(true)}
                                                disabled={saving}
                                            >
                                                Deactivate
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="adm-inline">
                                            <Button
                                                variant="primary"
                                                onClick={() => changeStatus(true)}
                                                disabled={saving}
                                            >
                                                Activate account
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            </>
                        )}
                    </div>
                )}
            </AdminModal>

            <ConfirmModal
                isOpen={confirmOpen}
                danger
                title="Deactivate this account?"
                description={`${user?.name || "This user"} will no longer be able to sign in or use the system.`}
                warning="You can reactivate the account at any time."
                confirmText="Deactivate"
                loading={saving}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => changeStatus(false)}
            />
        </>
    );
};

export default UserDetailsModal;