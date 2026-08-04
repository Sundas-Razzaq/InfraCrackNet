import authApi from "./authApi";

// START AI ANALYSIS
export const startAnalysis = async (inspectionId) => {
    const response = await authApi.post(
        `/analysis/run/${inspectionId}`
    );

    return response.data;
};

// GET LATEST ANALYSIS FOR AN INSPECTION
export const getInspectionAnalysis =
    async (inspectionId) => {
        const response = await authApi.get(
            `/analysis/inspection/${inspectionId}`
        );

        return response.data;
    };

// GET ANALYSIS PROGRESS
export const getAnalysisProgress = async (
    analysisId
) => {
    const response = await authApi.get(
        `/analysis/${analysisId}/progress`
    );

    return response.data;
};

// GET ANALYSIS RESULTS
export const getAnalysisResults = async (
    analysisId
) => {
    const response = await authApi.get(
        `/analysis/${analysisId}/results`
    );

    return response.data;
};

// CANCEL ANALYSIS
export const cancelAnalysis = async (
    analysisId
) => {
    const response = await authApi.patch(
        `/analysis/${analysisId}/cancel`
    );

    return response.data;
};