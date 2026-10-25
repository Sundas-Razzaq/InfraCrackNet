import { useEffect, useState } from "react";
import { getMemberImpact } from "../api/adminApi";
import { getApiErrorMessage } from "../api/authApi";

// Loads the removal / replacement impact preview for a team member.
export function useMemberImpact(teamId, userId) {
    const [impact, setImpact] = useState(null);
    const [loading, setLoading] = useState(Boolean(userId));
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) return undefined;

        let cancelled = false;

        const run = async () => {
            try {
                const res = await getMemberImpact(teamId, userId);
                if (!cancelled) setImpact(res.data);
            } catch (err) {
                if (!cancelled) setError(getApiErrorMessage(err, "Failed to check impact."));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [teamId, userId]);

    return { impact, loading, error };
}