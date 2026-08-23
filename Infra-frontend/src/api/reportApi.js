import authApi from "./authApi";

// GET ALL REPORTS
export const getAllReports = async () => {
    const response = await authApi.get("/reports");

    return response.data;
};

// GET SINGLE REPORT
export const getReport = async (reportId) => {
    const response = await authApi.get(
        `/reports/${reportId}`
    );

    return response.data;
};

// GENERATE REPORT
export const generateReport = async (analysisId) => {
    const response = await authApi.post(
        `/reports/${analysisId}/generate`
    );

    return response.data;
};

// DOWNLOAD REPORT
export const downloadReport = async (reportId) => {
    const response = await authApi.get(
        `/reports/${reportId}/download`,
        {
            responseType: "blob",
        }
    );

    return response;
};

// GET REPORT COUNT

export const getReportCount = async () => {
    const response = await authApi.get(
        "/reports/stats/count"
    );

    return response.data;
};