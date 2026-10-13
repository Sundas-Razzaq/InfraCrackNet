import authApi from "./authApi";

export const searchAll = async (query) => {
    const { data } = await authApi.get("/search", {
        params: { q: query },
    });

    return data;
};