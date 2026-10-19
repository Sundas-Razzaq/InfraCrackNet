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
module.exports = router;