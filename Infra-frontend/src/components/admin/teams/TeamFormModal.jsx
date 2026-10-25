import { useState } from "react";
import { toast } from "react-toastify";

import AdminModal from "../AdminModal";
import { createTeam, updateTeam } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";

const TeamFormModal = ({ team = null, onClose, onSaved }) => {
    const isEdit = Boolean(team);

    const [name, setName] = useState(team?.name || "");
    const [description, setDescription] = useState(team?.description || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const payload = { name: name.trim(), description: description.trim() };

        if (payload.name.length < 2) {
            setError("Team name must be at least 2 characters.");
            return;
        }

        setLoading(true);

        try {
            const res = isEdit
                ? await updateTeam(team._id, payload)
                : await createTeam(payload);

            toast.success(res.message);
            onSaved(res.data);
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to save team."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminModal
            isOpen
            title={isEdit ? "Edit Team" : "Create Team"}
            subtitle={
                isEdit
                    ? "Update the team name or description."
                    : "New teams start Inactive. Assign an Engineer lead, then activate."
            }
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" form="team-form" className="btn-primary" disabled={loading}>
                        {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Team"}
                    </button>
                </>
            }
        >
            <form id="team-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label className="form-label" htmlFor="team-name">
                        Team name
                    </label>
                    <input
                        id="team-name"
                        className="input"
                        maxLength={80}
                        placeholder="e.g. Bridge Inspection Team A"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoFocus
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="team-description">
                        Description (optional)
                    </label>
                    <textarea
                        id="team-description"
                        className="input"
                        rows={3}
                        maxLength={500}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>

                {error && <p className="form-error">{error}</p>}
            </form>
        </AdminModal>
    );
};

export default TeamFormModal;