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