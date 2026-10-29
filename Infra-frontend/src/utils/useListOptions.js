import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/authApi";

// Loads up to 100 records for dropdowns and pickers.
export function useListOptions(fetcher, params = {}) {
    const key = JSON.stringify(params);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                const res = await fetcher({ limit: 100, ...JSON.parse(key) });
                if (!cancelled) setItems(res.data || []);
            } catch (err) {
                if (!cancelled) setError(getApiErrorMessage(err, "Failed to load options."));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [fetcher, key]);

    return { items, loading, error };
}