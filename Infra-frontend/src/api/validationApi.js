import authApi from "./authApi";

// Get validation / analysis results
export const getValidationResults = async (
    analysisId
) => {
    const response = await authApi.get(
        `/analysis/${analysisId}/results`
    );

    return response.data;
};


// Approve AI analysis
export const approveAnalysis = async (
    analysisId
) => {
    const response = await authApi.patch(
        `/analysis/${analysisId}/approve`
    );

    return response.data;
};


// Reject AI analysis
export const rejectAnalysis = async (
    analysisId,
    rejectionReason
) => {
    const response = await authApi.patch(
        `/analysis/${analysisId}/reject`,
        {
            rejectionReason,
        }
    );

    return response.data;
};