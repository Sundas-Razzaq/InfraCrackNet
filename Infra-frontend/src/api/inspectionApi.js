import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const inspectionApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

const readToken = () => {
    try {
        const raw = localStorage.getItem("authState");
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        return parsed?.token || null;
    } catch {
        return null;
    }
};

inspectionApi.interceptors.request.use((config) => {
    const token = readToken();

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getBackendOrigin = () => {
    try {
        const url = new URL(API_BASE_URL);
        return `${url.protocol}//${url.host}`;
    } catch {
        return "http://localhost:5000";
    }
};

export const buildAssetUrl = (relativePath) => {
    if (!relativePath || typeof relativePath !== "string") {
        return "";
    }

    if (/^https?:\/\//i.test(relativePath)) {
        return relativePath;
    }

    const cleanPath = relativePath.replace(/^\/+/, "");
    return `${getBackendOrigin()}/${cleanPath}`;
};

export const uploadInspection = async (formData) => {
    const { data } = await inspectionApi.post("/inspections/upload", formData);

    return data;
};

export const getInspectionHistory = async () => {
    const { data } = await inspectionApi.get("/inspections/history");
    return data;
};

export const getInspectionById = async (id) => {
    const { data } = await inspectionApi.get(`/inspections/${id}`);
    return data;
};

const parseFilename = (contentDisposition, fallback = "inspection-report.pdf") => {
    if (!contentDisposition) {
        return fallback;
    }

    const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utfMatch && utfMatch[1]) {
        return decodeURIComponent(utfMatch[1]);
    }

    const plainMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
    if (plainMatch && plainMatch[1]) {
        return plainMatch[1];
    }

    return fallback;
};

export const downloadInspectionReport = async (id) => {
    const response = await inspectionApi.get(`/inspections/report/${id}`, {
        responseType: "blob",
    });

    const disposition = response.headers?.["content-disposition"];
    const filename = parseFilename(disposition);
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
};

export default inspectionApi;
