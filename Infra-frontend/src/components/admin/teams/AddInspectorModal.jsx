import { useState } from "react";
import { toast } from "react-toastify";

import AdminModal from "../AdminModal";
import MemberPicker from "./MemberPicker";
import { addTeamMember } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";

const AddInspectorModal = ({ team, onClose, onAdded }) => {
    const [selected, setSelected] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        if (!selected) return;

        setSaving(true);

        try {
            const res = await addTeamMember(team._id, { userId: selected._id });
            toast.success(res.message);
            (res.warnings || []).forEach((text) => toast.warning(text));
            onAdded();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to add inspector."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminModal
            isOpen
            title="Add Inspector"
            subtitle={`Add an Inspector to ${team.name}`}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
                        Cancel
                    </button>
                    <button type="button" className="btn-primary" onClick={handleAdd} disabled={!selected || saving}>
                        {saving ? "Adding..." : "Add to Team"}
                    </button>
                </>
            }
        >
            <MemberPicker role="Inspector" selectedId={selected?._id} onSelect={setSelected} />
        </AdminModal>
    );
};

export default AddInspectorModal;