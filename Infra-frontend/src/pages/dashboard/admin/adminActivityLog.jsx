import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import { Chip } from "../../../components/dashboard/shared/DetailsKit";
import { findAdminItem } from "../../../components/dashboard/sidebar/sidebarConfig";
import ActivityDetailsModal from "../../../components/admin/ActivityDetailsModal";
import DataTable from "../../../components/admin/DataTable";
import Pagination from "../../../components/admin/Pagination";
import { DateRangeFilter, FilterSelect } from "../../../components/admin/AdminFilters";

import { getActivityLog, getManagedUsers } from "../../../api/adminApi";
import { useAdminList } from "../../../utils/useAdminList";
import { useListOptions } from "../../../utils/useListOptions";
import { ACTIVITY_ACTION_GROUPS, ACTIVITY_TARGET_TYPES, actionLabel } from "../../../utils/activityActions";
import { formatDateTime, paramsToFilters, withDateRange } from "../../../utils/adminFormat";

const FILTER_KEYS = ["action", "actor", "targetType", "targetId", "outcome"];
const ACTOR_PARAMS = { sort: "name" };

const fetchActivity = (params) => getActivityLog(withDateRange(params));

const columns = [
    { key: "createdAt", header: "When", render: (row) => formatDateTime(row.createdAt) },
    {
        key: "actor",
        header: "Actor",
        render: (row) => (
            <div>
                {row.actor?.name || row.actorRole}
                {row.actor && <div className="adm-subtext">{row.actorRole}</div>}
            </div>
        ),
    },
    { key: "action", header: "Action", render: (row) => actionLabel(row.action) },
    {
        key: "target",
        header: "Target",
        render: (row) => (
            <div>
                {row.targetLabel || "-"}
                <div className="adm-subtext">{row.targetType}</div>
            </div>
        ),
    },
    {
        key: "outcome",
        header: "Outcome",
        render: (row) => (
            <Chip tone={row.outcome === "failure" ? "danger" : "success"}>
                {row.outcome === "failure" ? "Failed" : "Success"}
            </Chip>
        ),
    },
    {
        key: "message",
        header: "Details",
        render: (row) => <span className="adm-clamp">{row.message || "-"}</span>,
    },
];

const AdminActivityLogPage = () => {
    const [params] = useSearchParams();
    const [selected, setSelected] = useState(null);

    const { items, pagination, loading, error, filters, setFilter } = useAdminList(
        fetchActivity,
        { limit: 20, ...paramsToFilters(params, FILTER_KEYS) }
    );

    const { items: users } = useListOptions(getManagedUsers, ACTOR_PARAMS);

    const clearTarget = () => {
        setFilter("targetId", "");
        setFilter("targetType", "");
    };

    return (
        <div className="adm-page">
            <PageHeader title="Activity Log" subtitle={findAdminItem("activity-log")?.description} />

            {filters.targetId && (
                <div className="adm-banner" role="note">
                    <span>
                        Showing activity for one {(filters.targetType || "item").toLowerCase()} only.
                    </span>
                    <button type="button" className="btn-ghost btn-sm" onClick={clearTarget}>
                        Show all
                    </button>
                </div>
            )}

            <div className="adm-toolbar">
                <select
                    className="input"
                    value={filters.action || ""}
                    onChange={(event) => setFilter("action", event.target.value)}
                >
                    <option value="">All actions</option>
                    {ACTIVITY_ACTION_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                            {group.actions.map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>

                <FilterSelect
                    value={filters.actor}
                    onChange={(v) => setFilter("actor", v)}
                    allLabel="All actors"
                    options={users.map((u) => ({ value: u._id, label: `${u.name} (${u.role})` }))}
                />
                <FilterSelect
                    value={filters.targetType}
                    onChange={(v) => setFilter("targetType", v)}
                    allLabel="All targets"
                    options={ACTIVITY_TARGET_TYPES}
                />
                <FilterSelect
                    value={filters.outcome}
                    onChange={(v) => setFilter("outcome", v)}
                    allLabel="Any outcome"
                    options={[
                        { value: "success", label: "Success" },
                        { value: "failure", label: "Failed" },
                    ]}
                />

                <DateRangeFilter from={filters.from} to={filters.to} onChange={setFilter} />
            </div>

            <DataTable
                columns={columns}
                rows={items}
                loading={loading}
                error={error}
                emptyText="No activity found."
                onRowClick={setSelected}
            />

            <Pagination pagination={pagination} onPageChange={(page) => setFilter("page", page)} />

            {selected && <ActivityDetailsModal entry={selected} onClose={() => setSelected(null)} />}
        </div>
    );
};

export default AdminActivityLogPage;