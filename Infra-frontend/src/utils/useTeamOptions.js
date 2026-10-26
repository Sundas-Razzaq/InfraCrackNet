import { useEffect, useState } from "react";
import { getTeams } from "../api/adminApi";
import { getApiErrorMessage } from "../api/authApi";

// Loads up to 100 teams for dropdowns and pickers.
export function useTeamOptions(params = {}) {
    const key = JSON.stringify(params);

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                const res = await getTeams({ limit: 100, sort: "name", ...JSON.parse(key) });
                if (!cancelled) setTeams(res.data || []);
            } catch (err) {
                if (!cancelled) setError(getApiErrorMessage(err, "Failed to load teams."));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [key]);

    return { teams, loading, error };
}