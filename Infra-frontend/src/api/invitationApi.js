import authApi from "./authApi";
//public endpoints
export const getInvitationByToken = async (token) =>
    (await authApi.get(`/invitations/${token}`)).data;

export const acceptInvitation = async (token, payload) =>
    (await authApi.post(`/invitations/${token}/accept`, payload)).data;

export const acceptInvitationExisting = async (token) =>
    (await authApi.post(`/invitations/${token}/accept-existing`)).data;

export const rejectInvitation = async (token) =>
    (await authApi.post(`/invitations/${token}/reject`)).data;