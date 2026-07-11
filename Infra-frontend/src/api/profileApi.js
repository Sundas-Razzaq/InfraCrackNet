import authApi from "./authApi";

export const getProfile = async () => {
    const { data } = await authApi.get("/profile");
    return data;
};

export const updateProfile = async (payload) => {
    const { data } = await authApi.put("/profile", payload);
    return data;
};