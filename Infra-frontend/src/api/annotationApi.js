import authApi from "./authApi";

// Workspace
export const getAnnotationWorkspace = async (analysisId) => {
    const response = await authApi.get(`/annotations/${analysisId}`);
    return response.data;
};

// Update AI crack
export const updateCrack = async (crackId, data) => {
    const response = await authApi.patch(
        `/annotations/cracks/${crackId}`,
        data
    );
    return response.data;
};

// Remove AI crack
export const removeCrack = async (crackId) => {
    const response = await authApi.patch(
        `/annotations/cracks/${crackId}/remove`
    );
    return response.data;
};

// Add manual crack
export const addManualCrack = async (data) => {
    const response = await authApi.post(
        "/annotations/cracks",
        data
    );
    return response.data;
};

// Validate crack
export const validateCrack = async (crackId) => {
    const response = await authApi.patch(
        `/annotations/cracks/${crackId}/validate`
    );
    return response.data;
};

// Complete review
export const completeAnnotationReview = async (analysisId) => {
    const response = await authApi.patch(
        `/annotations/${analysisId}/complete`
    );
    return response.data;
};