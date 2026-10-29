import { getAdminProjects } from "../api/adminApi";
import { useListOptions } from "./useListOptions";

export function useProjectOptions(params = {}) {
    const { items, loading, error } = useListOptions(getAdminProjects, { sort: "name", ...params });
    return { projects: items, loading, error };
}