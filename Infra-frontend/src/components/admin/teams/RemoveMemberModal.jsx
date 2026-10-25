import { useState } from "react";
import { toast } from "react-toastify";

import AdminModal from "../AdminModal";
import ImpactSummary from "./ImpactSummary";
import { removeTeamMember } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { useMemberImpact } from "../../../utils/useMemberImpact";

const RemoveMemberModal = ({ team, member, onClose, onRemoved }) => {
    const { impact, loading, error } = useMemberImpact(team._id, member._id);
    const [saving, setSaving] = useState(false);

    const handleRemove = async () => {
        setSaving(true);

        try {
            const res = await removeTeamMember(team._id, member._id);
            toast.success(res.message);
            (res.warnings || []).forEach((text) => toast.warning(text));
            onRemoved();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to remove inspector."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminModal
            isOpen
            title="Remove Inspector"
            subtitle={`${member.name} will be removed from ${team.name}.`}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn-danger"
                        onClick={handleRemove}
                        disabled={saving || loading || !impact?.canProceed}
                    >
                        {saving ? "Removing..." : "Remove from Team"}
                    </button>
                </>
            }
        >
            {loading && <p className="adm-table-state">Checking impact...</p>}
            {!loading && error && <p className="form-error">{error}</p>}
            {impact && <ImpactSummary impact={impact} />}
        </AdminModal>
    );
};

export default RemoveMemberModal;