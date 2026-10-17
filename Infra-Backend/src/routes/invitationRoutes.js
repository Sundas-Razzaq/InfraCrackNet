const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getInvitationByToken,
    acceptInvitation,
    acceptInvitationExisting,
    rejectInvitation,
} = require("../controllers/invitationController");

const {
    invitationTokenParamValidation,
    acceptInvitationValidation,
} = require("../validations/invitationValidators");

// Public: the invitation token itself is the credential.
router.get("/:token", invitationTokenParamValidation, getInvitationByToken);

router.post(
    "/:token/accept",
    invitationTokenParamValidation,
    acceptInvitationValidation,
    acceptInvitation
);

// Existing users must be logged in.
router.post(
    "/:token/accept-existing",
    invitationTokenParamValidation,
    protect,
    acceptInvitationExisting
);

router.post(
    "/:token/reject",
    invitationTokenParamValidation,
    rejectInvitation
);

module.exports = router;