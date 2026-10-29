import { useNavigate, useSearchParams } from "react-router-dom";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import { findAdminItem } from "../../../components/dashboard/sidebar/sidebarConfig";
import SeverityBadge from "../../../components/analysis/SeverityBadge";
import AiSimulatedBanner from "../../../components/admin/AiSimulatedBanner";
import DataTable from "../../../components/admin/DataTable";
import Pagination from "../../../components/admin/Pagination";
import StatusChip from "../../../components/admin/StatusChip";
import ValidationBadge from "../../../components/admin/ValidationBadge";
import { DateRangeFilter, FilterSelect } from "../../../components/admin/AdminFilters";

import { getAdminAnalyses } from "../../../api/adminApi";
import { useAdminList } from "../../../utils/useAdminList";
import { useProjectOptions } from "../../../utils/useProjectOptions";
import { useTeamOptions } from "../../../utils/useTeamOptions";
import { formatDate, paramsToFilters, withDateRange } from "../../../utils/adminFormat";

const STATUSES = ["Queued", "Processing", "Completed", "Failed", "Cancelled"];
const VALIDATIONS = ["Pending", "Approved", "Rejected"];
const SEVERITIES = ["Low", "Medium", "High", "Critical"];
const FILTER_KEYS = ["status", "validationStatus", "severity", "stuck", "project", "team"];

const fetchAnalyses = (params) => getAdminAnalyses(withDateRange(params));

const columns = [
    {
        key: "analysis",
        header: "Analysis",
        render: (row) => (
            <div>
                <strong>{row.analysisCode}</strong>
                <div className="adm-subtext">v{row.analysisVersion || 1}</div>
            </div>
        ),
    },
    {
        key: "inspection",
        header: "Inspection",
        render: (row) => (
            <div>
                {row.inspection?.inspectionCode || "-"}
                <div className="adm-subtext">{row.inspection?.project?.name}</div>
            </div>
        ),
    },
    { key: "team", header: "Team", render: (row) => row.inspection?.project?.team?.name || "-" },
    { key: "status", header: "Status", render: (row) => <StatusChip value={row.status} /> },
    { key: "validation", header: "Validation", render: (row) => <ValidationBadge value={row.validationStatus} /> },
    {
        key: "severity",
        header: "Severity",
        render: (row) => (row.overallSeverity ? <SeverityBadge severity={row.overallSeverity} /> : "-"),
    },
    { key: "risk", header: "Risk", render: (row) => (row.riskScore != null ? `${row.riskScore}%` : "-") },
    {
        key: "confidence",
        header: "Confidence",
        render: (row) => (row.averageConfidence != null ? `${Number(row.averageConfidence).toFixed(1)}%` : "-"),
    },
    { key: "createdAt", header: "Created", render: (row) => formatDate(row.createdAt) },
];

const AdminAnalysesPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const { items, pagination, extra, loading, error, filters, setFilter } = useAdminList(
        fetchAnalyses,
        paramsToFilters(params, FILTER_KEYS)
    );

    const { projects } = useProjectOptions();
    const { teams } = useTeamOptions();

    const stuckOnly = filters.stuck === "true";

    return (
        <div className="adm-page">
            <PageHeader title="AI Analyses" subtitle={findAdminItem("analyses")?.description} />

            <AiSimulatedBanner aiMode={extra?.aiMode} disclaimer={extra?.aiDisclaimer} />

            <div className="adm-toolbar">
                <input
                    className="input"
                    placeholder="Search by analysis code"
                    value={filters.search}
                    onChange={(event) => setFilter("search", event.target.value)}
                />

                <FilterSelect
                    value={filters.status}
                    onChange={(v) => setFilter("status", v)}
                    allLabel="All statuses"
                    options={STATUSES}
                    disabled={stuckOnly}
                />
                <FilterSelect value={filters.validationStatus} onChange={(v) => setFilter("validationStatus", v)} allLabel="All validations" options={VALIDATIONS} />
                <FilterSelect value={filters.severity} onChange={(v) => setFilter("severity", v)} allLabel="All severities" options={SEVERITIES} />
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

                <DateRangeFilter from={filters.from} to={filters.to} onChange={setFilter} />

                <FilterSelect
                    value={filters.sort}
                    onChange={(v) => setFilter("sort", v)}
                    allLabel="Newest first"
                    options={[{ value: "oldest", label: "Oldest first" }]}
                />

                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={stuckOnly}
                        onChange={(event) => setFilter("stuck", event.target.checked ? "true" : "")}
                    />
                    <span>Stuck only</span>
                </label>
            </div>

            <DataTable
                columns={columns}
                rows={items}
                loading={loading}
                error={error}
                emptyText="No analyses found."
                onRowClick={(row) => navigate(`/dashboard/admin/analyses/${row._id}`)}
            />

            <Pagination pagination={pagination} onPageChange={(page) => setFilter("page", page)} />
        </div>
    );
};

export default AdminAnalysesPage;