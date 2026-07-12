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

export const uploadProfilePhoto = async (file) => {
    const formData = new FormData();

    formData.append("profileImage", file);

    const { data } = await authApi.put(
        "/profile/photo",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
};