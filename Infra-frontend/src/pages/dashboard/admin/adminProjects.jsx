import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import { Chip } from "../../../components/dashboard/shared/DetailsKit";
import { findAdminItem } from "../../../components/dashboard/sidebar/sidebarConfig";
import DataTable from "../../../components/admin/DataTable";
import Pagination from "../../../components/admin/Pagination";
import StatusChip from "../../../components/admin/StatusChip";

import { getAdminProjects } from "../../../api/adminApi";
import { useAdminList } from "../../../utils/useAdminList";
import { useTeamOptions } from "../../../utils/useTeamOptions";
import { formatDate, paramsToFilters } from "../../../utils/adminFormat";

const columns = [
    {
        key: "name",
        header: "Project",
        render: (project) => (
            <div>
                <strong>{project.name}</strong>
                <div className="adm-subtext">{project.projectCode}</div>
            </div>
        ),
    },
    { key: "structureType", header: "Structure" },
    { key: "priority", header: "Priority", render: (project) => <StatusChip value={project.priority} /> },
    { key: "status", header: "Status", render: (project) => <StatusChip value={project.status} /> },
    {
        key: "team",
        header: "Team",
        render: (project) =>
            project.team ? (
                <div>
                    {project.team.name}
                    <div className="adm-subtext">Lead: {project.team.engineerLead?.name || "-"}</div>
                </div>
            ) : (
                <Chip tone="warning">Unassigned</Chip>
            ),
    },
    { key: "createdAt", header: "Created", render: (project) => formatDate(project.createdAt) },
];

const FILTER_KEYS = ["status", "priority", "structureType", "assignment", "teamId"];

const AdminProjectsPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const { items, pagination, loading, error, filters, setFilter } = useAdminList(
        getAdminProjects,
        paramsToFilters(params, FILTER_KEYS)
    );

    const { teams } = useTeamOptions();

    return (
        <div className="adm-page">
            <PageHeader title="Projects" subtitle={findAdminItem("projects")?.description}>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/dashboard/admin/projects/new")}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    New Project
                </button>
            </PageHeader>

            <div className="adm-toolbar">
                <input
                    className="input"
                    placeholder="Search by name, code or location"
                    value={filters.search}
                    onChange={(event) => setFilter("search", event.target.value)}
                />

                <select className="input" value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)}>
                    <option value="">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                </select>

                <select className="input" value={filters.priority || ""} onChange={(e) => setFilter("priority", e.target.value)}>
                    <option value="">All priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>

                <select
                    className="input"
                    value={filters.structureType || ""}
                    onChange={(e) => setFilter("structureType", e.target.value)}
                >
                    <option value="">All structures</option>
                    <option value="Bridge">Bridge</option>
                    <option value="Building">Building</option>
                    <option value="Road">Road</option>
                </select>

                <select className="input" value={filters.assignment || ""} onChange={(e) => setFilter("assignment", e.target.value)}>
                    <option value="">Assigned or not</option>
                    <option value="assigned">Assigned</option>
                    <option value="unassigned">Unassigned</option>
                </select>

                <select className="input" value={filters.teamId || ""} onChange={(e) => setFilter("teamId", e.target.value)}>
                    <option value="">All teams</option>
                    {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                            {team.name}
                        </option>
                    ))}
                </select>

                <select className="input" value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)}>
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
                emptyText="No projects found."
                onRowClick={(project) => navigate(`/dashboard/admin/projects/${project._id}`)}
            />

            <Pagination pagination={pagination} onPageChange={(page) => setFilter("page", page)} />
        </div>
    );
};

export default AdminProjectsPage;