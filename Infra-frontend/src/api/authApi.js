import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const authApi = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getApiErrorMessage = (error, fallbackMessage) => {
    const responseData = error?.response?.data;
    const fallback = fallbackMessage || "Something went wrong. Please try again.";

    const errors = responseData?.errors;
    if (Array.isArray(errors) && errors.length > 0) {
        const message = errors
            .map((item) => item?.message || item)
            .filter(Boolean)
            .join(" ");

        if (message) {
            return message;
        }
    }

    return responseData?.message || error?.message || fallback;
};

export const signup = async (payload) => {
    const { data } = await authApi.post("/auth/signup", payload);
    return data;
};

export const login = async (payload) => {
    const { data } = await authApi.post("/auth/login", payload);
    return data;
};

export const logout = async () => {
    const { data } = await authApi.post("/auth/logout");
    return data;
};

export const forgotPassword = async (payload) => {
    const { data } = await authApi.post("/auth/forgot-password", payload);
    return data;
};

export const resetPassword = async (token, payload) => {
    const { data } = await authApi.post(`/auth/reset-password/${token}`, payload);
    return data;
};

export const getCurrentUser = async () => {
    const { data } = await authApi.get("/auth/me");
    return data;
};

export default authApi;
