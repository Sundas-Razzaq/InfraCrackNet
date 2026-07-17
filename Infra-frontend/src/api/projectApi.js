import authApi from "./authApi";

/* Create Project */
export const createProject = async (projectData) => {
    const { data } = await authApi.post(
        "/projects",
        projectData
    );

    return data;
};

/* Get All Projects */
export const getProjects = async () => {
    const { data } = await authApi.get("/projects");

    return data;
};

/* Get Single Project */
export const getProjectById = async (projectId) => {
    const { data } = await authApi.get(
        `/projects/${projectId}`
    );

    return data;
};

/* Update Project */
export const updateProject = async (
    projectId,
    projectData
) => {
    const { data } = await authApi.put(
        `/projects/${projectId}`,
        projectData
    );

    return data;
};

/* Delete Project */
export const deleteProject = async (projectId) => {
    const { data } = await authApi.delete(
        `/projects/${projectId}`
    );

    return data;
};