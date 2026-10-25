import authApi from "./authApi";

const clean = (params = {}) =>
    Object.fromEntries(
        Object.entries(params).filter(
            ([, v]) => v !== "" && v !== undefined && v !== null
        )
    );

const get = async (url, params) =>
    (await authApi.get(`/admin${url}`, { params: clean(params) })).data;
const post = async (url, body) => (await authApi.post(`/admin${url}`, body)).data;
const put = async (url, body) => (await authApi.put(`/admin${url}`, body)).data;
const patch = async (url, body) => (await authApi.patch(`/admin${url}`, body)).data;
const del = async (url, params) =>
    (await authApi.delete(`/admin${url}`, { params: clean(params) })).data;

/* Profile / Dashboard / Activity */
export const getAdminMe = () => get("/me");
export const getAdminDashboard = () => get("/dashboard");
export const getActivityLog = (params) => get("/activity-log", params);

/* Invitations */
export const createInvitation = (payload) => post("/invitations", payload);
export const getInvitations = (params) => get("/invitations", params);
export const resendInvitation = (id) => post(`/invitations/${id}/resend`);

/* Users */
export const getManagedUsers = (params) => get("/users", params);
export const getManagedUser = (id) => get(`/users/${id}`);
export const updateUserStatus = (id, payload) => patch(`/users/${id}/status`, payload);
export const updateUserRole = (id, payload) => patch(`/users/${id}/role`, payload);

/* Teams */
export const createTeam = (payload) => post("/teams", payload);
export const getTeams = (params) => get("/teams", params);
export const getAvailableMembers = (params) => get("/teams/available-members", params);
export const getTeamById = (id) => get(`/teams/${id}`);
export const updateTeam = (id, payload) => patch(`/teams/${id}`, payload);
export const updateTeamStatus = (id, payload) => patch(`/teams/${id}/status`, payload);
export const setTeamLead = (id, payload) => put(`/teams/${id}/lead`, payload);
export const addTeamMember = (id, payload) => post(`/teams/${id}/members`, payload);
export const removeTeamMember = (id, userId) => del(`/teams/${id}/members/${userId}`);
export const getMemberImpact = (id, userId) => get(`/teams/${id}/members/${userId}/impact`);

/* Projects */
export const createAdminProject = (payload) => post("/projects", payload);
export const getAdminProjects = (params) => get("/projects", params);
export const getAdminProject = (id) => get(`/projects/${id}`);
export const updateAdminProject = (id, payload) => patch(`/projects/${id}`, payload);
export const deleteAdminProject = (id, projectCode) =>
    del(`/projects/${id}`, { confirm: projectCode });
export const assignProjectTeam = (id, payload) => put(`/projects/${id}/team`, payload);
export const unassignProjectTeam = (id) => del(`/projects/${id}/team`);

/* Monitoring */
export const getAdminInspections = (params) => get("/inspections", params);
export const getAdminInspection = (id) => get(`/inspections/${id}`);
export const getAdminAnalyses = (params) => get("/analyses", params);
export const getAdminAnalysis = (id) => get(`/analyses/${id}`);
export const getAdminReports = (params) => get("/reports", params);
export const getAdminReport = (id) => get(`/reports/${id}`);
export const downloadAdminReport = async (id) => {
    const response = await authApi.get(`/admin/reports/${id}/download`, {
        responseType: "blob",
    });
    return response;
};