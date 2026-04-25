import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const authApi = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

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

export const getCurrentUser = async () => {
    const { data } = await authApi.get("/auth/me");
    return data;
};

export default authApi;
