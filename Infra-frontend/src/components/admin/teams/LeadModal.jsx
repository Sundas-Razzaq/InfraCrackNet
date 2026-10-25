import { useState } from "react";
import { toast } from "react-toastify";

import AdminModal from "../AdminModal";
import ImpactSummary from "./ImpactSummary";
import MemberPicker from "./MemberPicker";
import { setTeamLead } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { useMemberImpact } from "../../../utils/useMemberImpact";

const LeadModal = ({ team, onClose, onChanged }) => {
    const currentLead = team.engineerLead;
    const isReplace = Boolean(currentLead);

    // Only replacing a lead needs an impact check.
    const { impact, loading, error } = useMemberImpact(team._id, currentLead?._id);

    const [selected, setSelected] = useState(null);
    const [saving, setSaving] = useState(false);

    const blocked = isReplace && (loading || !impact || !impact.canProceed);

    const handleSave = async () => {
        if (!selected) return;

        setSaving(true);

        try {
            const res = await setTeamLead(team._id, { engineerId: selected._id });
            toast.success(res.message);
            onChanged();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update team lead."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminModal
            isOpen
            wide
            title={isReplace ? "Replace Engineer Lead" : "Assign Engineer Lead"}
            subtitle={
                isReplace
                    ? `Current lead: ${currentLead.name}`
                    : `Choose the Engineer who will lead ${team.name}.`
            }
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={!selected || blocked || saving}
                    >
                        {saving ? "Saving..." : isReplace ? "Replace Lead" : "Assign Lead"}
                    </button>
                </>
            }
        >
            <div className="adm-stack">
                {isReplace && loading && <p className="adm-table-state">Checking impact...</p>}
                {isReplace && !loading && error && <p className="form-error">{error}</p>}
                {isReplace && impact && <ImpactSummary impact={impact} />}

                <MemberPicker role="Engineer" selectedId={selected?._id} onSelect={setSelected} />
            </div>
        </AdminModal>
    );
};

export default LeadModal;