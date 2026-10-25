import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/authApi";
import { useDebounce } from "./useDebounce";

export function useAdminList(fetcher, initialFilters = {}) {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        sort: "newest",
        search: "",
        ...initialFilters,
    });
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [extra, setExtra] = useState(null); // full response (e.g. aiMode)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    const debouncedSearch = useDebounce(filters.search, 350);
    const queryKey = JSON.stringify({ ...filters, search: debouncedSearch });

    useEffect(() => {
        let cancelled = false;
        const params = JSON.parse(queryKey);

        const run = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetcher(params);
                if (cancelled) return;
                setItems(res.data || []);
                setPagination(res.pagination || null);
                setExtra(res);
            } catch (err) {
                if (!cancelled) setError(getApiErrorMessage(err, "Failed to load data."));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [fetcher, queryKey, reloadKey]);

    // Changing any filter except page goes back to page 1.
    const setFilter = useCallback((key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            ...(key === "page" ? {} : { page: 1 }),
        }));
    }, []);

    const reload = useCallback(() => setReloadKey((k) => k + 1), []);

    return { items, pagination, extra, loading, error, filters, setFilter, reload };
}