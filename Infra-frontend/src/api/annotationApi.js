import authApi from "./authApi";

// GET Annotation Workspace
export const getAnnotationWorkspace = async (analysisId) => {
    const { data } = await authApi.get(
        `/annotation/${analysisId}`
    );

    return data;
};