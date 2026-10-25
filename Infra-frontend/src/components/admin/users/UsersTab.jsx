import { useState } from "react";

import DataTable from "../DataTable";
import Pagination from "../Pagination";
import StatusChip from "../StatusChip";
import UserDetailsModal from "./UserDetailsModal";

import { getManagedUsers } from "../../../api/adminApi";
import { useAdminList } from "../../../utils/useAdminList";
import { formatDate } from "../../../utils/adminFormat";

const isActive = (user) => user.isActive !== false;

const columns = [
    {
        key: "name",
        header: "User",
        render: (user) => (
            <div>
                <strong>{user.name}</strong>
                <div className="adm-subtext">{user.email}</div>
            </div>
        ),
    },
    { key: "role", header: "Role", render: (user) => <StatusChip value={user.role} /> },
    { key: "team", header: "Team", render: (user) => user.team?.name || "-" },
    {
        key: "status",
        header: "Status",
        render: (user) => <StatusChip value={isActive(user) ? "Active" : "Inactive"} />,
    },
    { key: "createdAt", header: "Joined", render: (user) => formatDate(user.createdAt) },
];

const UsersTab = () => {
    const { items, pagination, loading, error, filters, setFilter, reload } =
        useAdminList(getManagedUsers);

    const [selectedId, setSelectedId] = useState(null);

    return (
        <>
            <div className="adm-toolbar">
                <input
                    className="input"
                    placeholder="Search by name or email"
                    value={filters.search}
                    onChange={(event) => setFilter("search", event.target.value)}
                />

                <select
                    className="input"
                    value={filters.role || ""}
                    onChange={(event) => setFilter("role", event.target.value)}
                >
                    <option value="">All roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Inspector">Inspector</option>
                </select>

                <select
                    className="input"
                    value={filters.status || ""}
                    onChange={(event) => setFilter("status", event.target.value)}
                >
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <select
                    className="input"
                    value={filters.sort}
                    onChange={(event) => setFilter("sort", event.target.value)}
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="name">Name (A-Z)</option>
                </select>
            </div>

            <DataTable
                columns={columns}
                rows={items}
                loading={loading}
                error={error}
                emptyText="No users found."
                onRowClick={(user) => setSelectedId(user._id)}
            />

            <Pagination pagination={pagination} onPageChange={(page) => setFilter("page", page)} />

            {selectedId && (
                <UserDetailsModal
                    userId={selectedId}
                    onClose={() => setSelectedId(null)}
                    onChanged={reload}
                />
            )}
        </>
    );
};

export default UsersTab;