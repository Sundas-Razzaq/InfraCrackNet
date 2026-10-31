import authApi from "./authApi";

/* The logged-in user's own team (read-only) */
export const getMyTeam = async () => {
    const { data } = await authApi.get("/teams/my");
    return data;
};