import authApi from "./authApi";

export const getValidationResults = async (analysisId) => {
    const response = await authApi.get(
        `/analysis/${analysisId}/results`
    );

    return response.data;
};