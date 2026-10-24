const express = require("express");
const router = express.Router();

const { protect, authorizeRoles, } = require("../middleware/authMiddleware");
const { getAdminProfile } = require("../controllers/adminController");
const { getActivityLogs } = require("../controllers/activityLogController");
const { listActivityLogsValidation, } = require("../validations/activityLogValidators");
const {
    createInvitation,
    listInvitations,
    resendInvitation,
} = require("../controllers/invitationController");
const {
    createInvitationValidation,
    listInvitationsValidation,
    invitationIdParamValidation,
} = require("../validations/invitationValidators");
const {
    listManagedUsers,
    getManagedUser,
    updateUserStatus,
    updateUserRole,
} = require("../controllers/userManagementController");
const {
    listManagedUsersValidation,
    userIdParamValidation,
    updateUserStatusValidation,
    updateUserRoleValidation,
} = require("../validations/userManagementValidators");
const {
    createTeam,
    listTeams,
    getTeam,
    updateTeam,
    updateTeamStatus,
    setTeamLead,
    addTeamMember,
    removeTeamMember,
    listAvailableMembers,
} = require("../controllers/teamController");
const {
    createTeamValidation,
    updateTeamValidation,
    listTeamsValidation,
    availableMembersValidation,
    teamIdParamValidation,
    teamMemberParamValidation,
    setLeadValidation,
    addMemberValidation,
    teamStatusValidation,
} = require("../validations/teamValidators");
const {
    createAdminProject,
    listAdminProjects,
    getAdminProject,
    updateAdminProject,
    assignProjectTeam,
    unassignProjectTeam,
    deleteAdminProject,
} = require("../controllers/adminProjectController");
const {
    createAdminProjectValidation,
    updateAdminProjectValidation,
    listAdminProjectsValidation,
    projectIdParamValidation,
    assignTeamValidation,
    deleteProjectQueryValidation,
} = require("../validations/adminProjectValidators");

// Every route added below this line is Admin-only automatically.
router.use(protect, authorizeRoles("Admin"));

router.get("/me", getAdminProfile);
router.get("/activity-log", listActivityLogsValidation, getActivityLogs);
router.post("/invitations", createInvitationValidation, createInvitation);
router.get("/invitations", listInvitationsValidation, listInvitations);
router.post("/invitations/:id/resend", invitationIdParamValidation, resendInvitation);
router.get("/users", listManagedUsersValidation, listManagedUsers);
router.get("/users/:id", userIdParamValidation, getManagedUser);
router.patch(
    "/users/:id/status",
    userIdParamValidation,
    updateUserStatusValidation,
    updateUserStatus
);
router.patch(
    "/users/:id/role",
    userIdParamValidation,
    updateUserRoleValidation,
    updateUserRole
);

router.post("/teams", createTeamValidation, createTeam);
router.get("/teams", listTeamsValidation, listTeams);
router.get(
    "/teams/available-members",
    availableMembersValidation,
    listAvailableMembers
);
router.get("/teams/:id", teamIdParamValidation, getTeam);
router.patch(
    "/teams/:id",
    teamIdParamValidation,
    updateTeamValidation,
    updateTeam
);
router.patch(
    "/teams/:id/status",
    teamIdParamValidation,
    teamStatusValidation,
    updateTeamStatus
);
router.put(
    "/teams/:id/lead",
    teamIdParamValidation,
    setLeadValidation,
    setTeamLead
);
router.post(
    "/teams/:id/members",
    teamIdParamValidation,
    addMemberValidation,
    addTeamMember
);
router.delete(
    "/teams/:id/members/:userId",
    teamMemberParamValidation,
    removeTeamMember
);
router.post("/projects", createAdminProjectValidation, createAdminProject);
router.get("/projects", listAdminProjectsValidation, listAdminProjects);
router.get("/projects/:id", projectIdParamValidation, getAdminProject);
router.patch(
    "/projects/:id",
    projectIdParamValidation,
    updateAdminProjectValidation,
    updateAdminProject
);
router.put(
    "/projects/:id/team",
    projectIdParamValidation,
    assignTeamValidation,
    assignProjectTeam
);
router.delete(
    "/projects/:id/team",
    projectIdParamValidation,
    unassignProjectTeam
);
router.delete(
    "/projects/:id",
    projectIdParamValidation,
    deleteProjectQueryValidation,
    deleteAdminProject
);
module.exports = router;