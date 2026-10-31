import authApi from "./authApi";

/* Get projects of my team */
export const getProjects = async () => {
    const { data } = await authApi.get("/projects");
    return data;
};

/* Get a single project (my team only) */
export const getProjectById = async (projectId) => {
    const { data } = await authApi.get(`/projects/${projectId}`);
    return data;
};

/* Update project details (Engineer only) */
export const updateProject = async (projectId, projectData) => {
    const { data } = await authApi.put(`/projects/${projectId}`, projectData);
    return data;
};