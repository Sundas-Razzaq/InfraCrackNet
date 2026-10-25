import { useState } from "react";
import { toast } from "react-toastify";

import DataTable from "../DataTable";
import Pagination from "../Pagination";
import StatusChip from "../StatusChip";

import { getInvitations, resendInvitation } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { useAdminList } from "../../../utils/useAdminList";
import { formatDate } from "../../../utils/adminFormat";

// The invitations endpoint filters by `email`, not `search`.
const fetchInvitations = (params) => getInvitations({ ...params, email: params.search });

const InvitationsTab = () => {
    const { items, pagination, loading, error, filters, setFilter, reload } =
        useAdminList(fetchInvitations);

    const [resendingId, setResendingId] = useState(null);

    const handleResend = async (invitation) => {
        setResendingId(invitation._id);

        try {
            const res = await resendInvitation(invitation._id);

            if (res.emailSent === false) {
                toast.warning(res.message);
            } else {
                toast.success(res.message);
            }

            reload();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to resend invitation."));
        } finally {
            setResendingId(null);
        }
    };

    const columns = [
        { key: "email", header: "Email" },
        { key: "role", header: "Role", render: (row) => <StatusChip value={row.role} /> },
        { key: "status", header: "Status", render: (row) => <StatusChip value={row.status} /> },
        {
            key: "invitedBy",
            header: "Invited by",
            render: (row) => row.invitedBy?.name || "-",
        },
        {
            key: "sent",
            header: "Sent",
            render: (row) => (
                <div>
                    {formatDate(row.lastSentAt || row.createdAt)}
                    {row.resendCount > 0 && (
                        <div className="adm-subtext">Resent {row.resendCount}x</div>
                    )}
                </div>
            ),
        },
        {
            key: "detail",
            header: "Validity",
            render: (row) =>
                row.status === "Pending" || row.status === "Expired"
                    ? `Expires ${formatDate(row.expiresAt)}`
                    : `Responded ${formatDate(row.respondedAt)}`,
        },
        {
            key: "actions",
            header: "",
            render: (row) =>
                row.status === "Pending" || row.status === "Expired" ? (
                    <button
                        type="button"
                        className="btn-outline btn-sm"
                        onClick={() => handleResend(row)}
                        disabled={resendingId === row._id}
                    >
                        {resendingId === row._id ? "Sending..." : "Resend"}
                    </button>
                ) : null,
        },
    ];

    return (
        <>
            <div className="adm-toolbar">
                <input
                    className="input"
                    placeholder="Search by email"
                    value={filters.search}
                    onChange={(event) => setFilter("search", event.target.value)}
                />

                <select
                    className="input"
                    value={filters.status || ""}
                    onChange={(event) => setFilter("status", event.target.value)}
                >
                    <option value="">All statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Expired">Expired</option>
                </select>

                <select
                    className="input"
                    value={filters.role || ""}
                    onChange={(event) => setFilter("role", event.target.value)}
                >
                    <option value="">All roles</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Inspector">Inspector</option>
                </select>
            </div>

            <DataTable
                columns={columns}
                rows={items}
                loading={loading}
                error={error}
                emptyText="No invitations found."
            />

            <Pagination pagination={pagination} onPageChange={(page) => setFilter("page", page)} />
        </>
    );
};

export default InvitationsTab;