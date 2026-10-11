import authApi from "./authApi";

/* List users, filtered by role */
export const getUsers = async ({ role } = {}) => {
    const params = role ? { role } : {};
    const { data } = await authApi.get("/users", { params });
    return data;
};

/* Convenience wrapper for the common case */
export const getInspectors = async () => {
    return getUsers({ role: "Inspector" });
};