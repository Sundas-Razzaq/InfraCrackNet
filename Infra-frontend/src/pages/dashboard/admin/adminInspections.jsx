import { useNavigate, useSearchParams } from "react-router-dom";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import { Chip } from "../../../components/dashboard/shared/DetailsKit";
import { findAdminItem } from "../../../components/dashboard/sidebar/sidebarConfig";
import InspectionStatusBadge from "../../../components/inspection/inspectionStatusBadge";
import DataTable from "../../../components/admin/DataTable";
import Pagination from "../../../components/admin/Pagination";
import StatusChip from "../../../components/admin/StatusChip";
import { DateRangeFilter, FilterSelect } from "../../../components/admin/AdminFilters";

import { getAdminInspections, getManagedUsers } from "../../../api/adminApi";
import { useAdminList } from "../../../utils/useAdminList";
import { useListOptions } from "../../../utils/useListOptions";
import { useProjectOptions } from "../../../utils/useProjectOptions";
import { useTeamOptions } from "../../../utils/useTeamOptions";
import { formatDate, paramsToFilters, withDateRange } from "../../../utils/adminFormat";

const STATUSES = [
    "Draft",
    "Images Uploaded",
    "Pending Analysis",
    "AI Processing",
    "AI Completed",
    "Validated",
    "Report Generated",
    "Completed",
];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const TYPES = ["Routine", "Emergency", "Maintenance", "Follow-up"];
const FILTER_KEYS = ["status", "priority", "inspectionType", "project", "team", "inspector"];
const INSPECTOR_PARAMS = { role: "Inspector", sort: "name" };

const fetchInspections = (params) => getAdminInspections(withDateRange(params));

const columns = [
    {
        key: "inspection",
        header: "Inspection",
        render: (row) => (
            <div>
                <strong>{row.inspectionCode}</strong>
                <div className="adm-subtext">{row.structureArea}</div>
            </div>
        ),
    },
    {
        key: "project",
        header: "Project",
        render: (row) => (
            <div>
                {row.project?.name || "-"}
                <div className="adm-subtext">{row.project?.projectCode}</div>
            </div>
        ),
    },
    {
        key: "team",
        header: "Team",
        render: (row) => row.project?.team?.name || <Chip tone="warning">Unassigned</Chip>,
    },
    { key: "inspector", header: "Inspector", render: (row) => row.createdBy?.name || "-" },
    { key: "inspectionType", header: "Type" },
    { key: "priority", header: "Priority", render: (row) => <StatusChip value={row.priority} /> },
    { key: "status", header: "Status", render: (row) => <InspectionStatusBadge status={row.status} /> },
    { key: "createdAt", header: "Created", render: (row) => formatDate(row.createdAt) },
];

const AdminInspectionsPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const { items, pagination, loading, error, filters, setFilter } = useAdminList(
        fetchInspections,
        paramsToFilters(params, FILTER_KEYS)
    );

    const { projects } = useProjectOptions();
    const { teams } = useTeamOptions();
    const { items: inspectors } = useListOptions(getManagedUsers, INSPECTOR_PARAMS);

    return (
        <div className="adm-page">
            <PageHeader title="Inspections" subtitle={findAdminItem("inspections")?.description} />

            <div className="adm-toolbar">
                <input
                    className="input"
                    placeholder="Search by inspection code or area"
                    value={filters.search}
                    onChange={(event) => setFilter("search", event.target.value)}
                />

                <FilterSelect value={filters.status} onChange={(v) => setFilter("status", v)} allLabel="All statuses" options={STATUSES} />
                <FilterSelect value={filters.priority} onChange={(v) => setFilter("priority", v)} allLabel="All priorities" options={PRIORITIES} />
                <FilterSelect value={filters.inspectionType} onChange={(v) => setFilter("inspectionType", v)} allLabel="All types" options={TYPES} />
                <FilterSelect
                    value={filters.project}
                    onChange={(v) => setFilter("project", v)}
                    allLabel="All projects"
                    options={projects.map((p) => ({ value: p._id, label: `${p.projectCode} · ${p.name}` }))}
                />
                <FilterSelect
                    value={filters.team}
                    onChange={(v) => setFilter("team", v)}
                    allLabel="All teams"
                    options={teams.map((t) => ({ value: t._id, label: t.name }))}
                />
                <FilterSelect
                    value={filters.inspector}
                    onChange={(v) => setFilter("inspector", v)}
                    allLabel="All inspectors"
                    options={inspectors.map((u) => ({ value: u._id, label: u.name }))}
                />

                <DateRangeFilter from={filters.from} to={filters.to} onChange={setFilter} />

                <FilterSelect
                    value={filters.sort}
                    onChange={(v) => setFilter("sort", v)}
                    allLabel="Newest first"
                    options={[{ value: "oldest", label: "Oldest first" }]}
                />
            </div>

            <DataTable
                columns={columns}
                rows={items}
                loading={loading}
                error={error}
                emptyText="No inspections found."
                onRowClick={(row) => navigate(`/dashboard/admin/inspections/${row._id}`)}
            />

            <Pagination pagination={pagination} onPageChange={(page) => setFilter("page", page)} />
        </div>
    );
};

export default AdminInspectionsPage;