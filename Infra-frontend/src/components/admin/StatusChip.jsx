import { Chip } from "../dashboard/shared/DetailsKit";

const ADMIN_TONES = {
    Active: "success",
    Inactive: "neutral",
    Pending: "warning",
    Accepted: "success",
    Rejected: "danger",
    Expired: "neutral",
    Queued: "info",
    Processing: "warning",
    Completed: "success",
    Failed: "danger",
    Cancelled: "neutral",
    Admin: "critical",
    Engineer: "info",
    Inspector: "neutral",
    Simulated: "warning",
    Final: "success",
};

const StatusChip = ({ value }) => <Chip tone={ADMIN_TONES[value]}>{value}</Chip>;

export default StatusChip;