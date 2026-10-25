import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import { Chip } from "../../../components/dashboard/shared/DetailsKit";
import { findAdminItem } from "../../../components/dashboard/sidebar/sidebarConfig";
import DataTable from "../../../components/admin/DataTable";
import Pagination from "../../../components/admin/Pagination";
import StatusChip from "../../../components/admin/StatusChip";
import TeamFormModal from "../../../components/admin/teams/TeamFormModal";

import { getTeams } from "../../../api/adminApi";
import { useAdminList } from "../../../utils/useAdminList";
import { formatDate } from "../../../utils/adminFormat";

const columns = [
    {
        key: "name",
        header: "Team",
        render: (team) => (
            <div>
                <strong>{team.name}</strong>
                {team.description && <div className="adm-subtext adm-clamp">{team.description}</div>}
            </div>
        ),
    },
    { key: "status", header: "Status", render: (team) => <StatusChip value={team.status} /> },
    {
        key: "lead",
        header: "Engineer Lead",
        render: (team) =>
            team.engineerLead ? (
                <div>
                    {team.engineerLead.name}
                    <div className="adm-subtext">{team.engineerLead.email}</div>
                </div>
            ) : (
                <Chip tone="warning">No lead</Chip>
            ),
    },
    {
        key: "inspectors",
        header: "Inspectors",
        render: (team) => String(team.memberCounts?.inspectors ?? 0),
    },
    { key: "createdAt", header: "Created", render: (team) => formatDate(team.createdAt) },
];

const AdminTeamsPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const [createOpen, setCreateOpen] = useState(false);

    // Dashboard links can pre-apply filters, e.g. ?hasLead=false
    const { items, pagination, loading, error, filters, setFilter } = useAdminList(getTeams, {
        status: params.get("status") || "",
        hasLead: params.get("hasLead") || "",
    });

    return (
        <div className="adm-page">
            <PageHeader title="Team Management" subtitle={findAdminItem("teams")?.description}>
                <button type="button" className="btn btn-primary" onClick={() => setCreateOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                    Create Team
                </button>
            </PageHeader>

            <div className="adm-toolbar">
                <input
                    className="input"
                    placeholder="Search by team name"
                    value={filters.search}
                    onChange={(event) => setFilter("search", event.target.value)}
                />

                <select
                    className="input"
                    value={filters.status || ""}
                    onChange={(event) => setFilter("status", event.target.value)}
                >
                    <option value="">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

                <select
                    className="input"
                    value={filters.hasLead || ""}
                    onChange={(event) => setFilter("hasLead", event.target.value)}
                >
                    <option value="">With or without lead</option>
                    <option value="true">With lead</option>
                    <option value="false">Without lead</option>
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
                emptyText="No teams found."
                onRowClick={(team) => navigate(`/dashboard/admin/teams/${team._id}`)}
            />

            <Pagination pagination={pagination} onPageChange={(page) => setFilter("page", page)} />

            {createOpen && (
                <TeamFormModal
                    onClose={() => setCreateOpen(false)}
                    onSaved={(team) => navigate(`/dashboard/admin/teams/${team._id}`)}
                />
            )}
        </div>
    );
};

export default AdminTeamsPage;