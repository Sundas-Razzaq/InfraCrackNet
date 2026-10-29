export const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "-";

export const formatDateTime = (value) =>
    value
        ? new Date(value).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "-";

// Reads dashboard deep-link filters, e.g. ?status=Active&assignment=unassigned
export const paramsToFilters = (params, keys) =>
    Object.fromEntries(keys.map((key) => [key, params.get(key) || ""]));

const startOfDay = (value) => new Date(`${value}T00:00:00`).toISOString();
const endOfDay = (value) => new Date(`${value}T23:59:59.999`).toISOString();

// Turns the date inputs (YYYY-MM-DD) into the ISO range the API expects.
export const withDateRange = ({ from, to, ...rest }) => ({
    ...rest,
    ...(from && { from: startOfDay(from) }),
    ...(to && { to: endOfDay(to) }),
});