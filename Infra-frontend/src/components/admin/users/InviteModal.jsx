import { useState } from "react";
import { toast } from "react-toastify";

import AdminModal from "../AdminModal";
import { createInvitation } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";

const InviteModal = ({ onClose, onInvited }) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Inspector");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const value = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const res = await createInvitation({ email: value, role });

            if (res.emailSent === false) {
                toast.warning(res.message);
            } else {
                toast.success(res.message);
            }

            onInvited();
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to send invitation."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminModal
            isOpen
            title="Invite User"
            subtitle="Send an email invitation. The link is valid for 3 days."
            onClose={onClose}
            footer={
                <>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="invite-form"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Invitation"}
                    </button>
                </>
            }
        >
            <form id="invite-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label className="form-label" htmlFor="invite-email">
                        Email address
                    </label>
                    <input
                        id="invite-email"
                        type="email"
                        className="input"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoFocus
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="invite-role">
                        Role
                    </label>
                    <select
                        id="invite-role"
                        className="input"
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                    >
                        <option value="Inspector">Inspector</option>
                        <option value="Engineer">Engineer</option>
                    </select>
                    <p className="form-hint">
                        The role comes from the invitation and cannot be changed by the invitee.
                    </p>
                </div>

                {error && <p className="form-error">{error}</p>}
            </form>
        </AdminModal>
    );
};

export default InviteModal;