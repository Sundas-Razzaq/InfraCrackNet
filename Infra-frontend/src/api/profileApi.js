import authApi from "./authApi";

export const getProfile = async () => {
    const { data } = await authApi.get("/profile");
    return data;
};

export const updateProfile = async (payload) => {
    const { data } = await authApi.put("/profile", payload);
    return data;
};

export const changePassword = async (payload) => {
    const { data } = await authApi.put(
        "/profile/change-password",
        payload
    );

    return data;
};