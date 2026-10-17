const mongoose = require("mongoose");

const Invitation = require("../models/invitation");
const User = require("../models/user");

const { hashPassword } = require("../services/authService");
const { sendInvitationEmail } = require("../services/emailService");
const { logActivity } = require("../services/activityLogService");
const {
    INVITATION_EXPIRY_DAYS,
    hashToken,
    issueToken,
    notifySafely,
    expireStaleInvitations,
} = require("../services/invitationService");
const { ACTIVITY_ACTIONS } = require("../utils/activityActions");

/*  helpers  */

const escapeRegex = (value) =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const deliverInvitation = async ({ invitation, token, invitedByName }) => {
    try {
        await sendInvitationEmail({
            to: invitation.email,
            role: invitation.role,
            token,
            invitedByName,
            validDays: INVITATION_EXPIRY_DAYS,
        });
        return true;
    } catch (error) {
        console.error("Invitation email failed:", error.message);
        return false;
    }
};

/* Finds the invitation for a raw token and checks it is still usable. */
const getPendingInvitation = async (token) => {
    await expireStaleInvitations();

    const invitation = await Invitation.findOne({
        tokenHash: hashToken(token),
    });

    if (!invitation) {
        return {
            error: {
                status: 404,
                message:
                    "This invitation link is invalid or has been replaced by a newer one.",
            },
        };
    }

    if (invitation.status !== "Pending") {
        return {
            error: {
                status: 410,
                message: `This invitation is no longer valid (${invitation.status.toLowerCase()}).`,
                invitationStatus: invitation.status,
            },
        };
    }

    return { invitation };
};

const sendInvitationError = (res, error) =>
    res.status(error.status).json({
        success: false,
        message: error.message,
        ...(error.invitationStatus && {
            invitationStatus: error.invitationStatus,
        }),
    });

/* Atomically moves a Pending, unexpired invitation to a new status.
   Returns null if someone else already responded or it just expired. */
const claimInvitation = (invitationId, update) =>
    Invitation.findOneAndUpdate(
        {
            _id: invitationId,
            status: "Pending",
            expiresAt: { $gt: new Date() },
        },
        { ...update, respondedAt: new Date() },
        { returnDocument: "after" }
    );

/* ADMIN ENDPOINTS*/

/* POST /api/admin/invitations */
const createInvitation = async (req, res, next) => {
    try {
        const { email, role } = req.body;

        await expireStaleInvitations();

        const existingUser = await User.findOne({ email }).select(
            "role isActive"
        );

        if (existingUser) {
            if (existingUser.role !== role) {
                return res.status(409).json({
                    success: false,
                    message: `This email is already registered as ${existingUser.role}. An invitation cannot change a user's role.`,
                });
            }

            if (existingUser.isActive === false) {
                return res.status(409).json({
                    success: false,
                    message: "This user's account is deactivated.",
                });
            }
        }

        const pending = await Invitation.findOne({
            email,
            status: "Pending",
        }).select("_id");

        if (pending) {
            return res.status(409).json({
                success: false,
                message:
                    "A pending invitation already exists for this email. Use resend instead.",
                invitationId: pending._id,
            });
        }

        const invitation = new Invitation({
            email,
            role,
            invitedBy: req.user.id,
        });

        const token = issueToken(invitation);

        try {
            await invitation.save();
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message:
                        "A pending invitation already exists for this email.",
                });
            }
            throw error;
        }

        const admin = await User.findById(req.user.id).select("name");

        const emailSent = await deliverInvitation({
            invitation,
            token,
            invitedByName: admin?.name,
        });

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.INVITATION_CREATED,
            targetType: "Invitation",
            targetId: invitation._id,
            targetLabel: invitation.email,
            metadata: { role: invitation.role, emailSent },
        });

        res.status(201).json({
            success: true,
            message: emailSent
                ? "Invitation sent successfully."
                : "Invitation created, but the email could not be sent. Use resend to try again.",
            emailSent,
            data: invitation,
        });
    } catch (error) {
        next(error);
    }
};

/* GET /api/admin/invitations */
const listInvitations = async (req, res, next) => {
    try {
        const { page, limit, status, role, email } = req.validatedQuery;

        await expireStaleInvitations();

        const filter = {};

        if (status) filter.status = status;
        if (role) filter.role = role;
        if (email) {
            filter.email = { $regex: escapeRegex(email), $options: "i" };
        }

        const [invitations, total] = await Promise.all([
            Invitation.find(filter)
                .populate("invitedBy", "name email")
                .populate("acceptedBy", "name email")
                .sort({ createdAt: -1, _id: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Invitation.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: invitations,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

/* POST /api/admin/invitations/:id/resend */
const resendInvitation = async (req, res, next) => {
    try {
        await expireStaleInvitations();

        const invitation = await Invitation.findById(req.params.id);

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found.",
            });
        }

        if (!["Pending", "Expired"].includes(invitation.status)) {
            return res.status(409).json({
                success: false,
                message: `Only pending or expired invitations can be resent (current status: ${invitation.status}).`,
            });
        }

        const before = {
            status: invitation.status,
            expiresAt: invitation.expiresAt,
        };

        // New token + new expiry. The old token stops working immediately.
        const token = issueToken(invitation);
        invitation.status = "Pending";
        invitation.resendCount += 1;

        try {
            await invitation.save();
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Another pending invitation already exists for this email.",
                });
            }
            throw error;
        }

        const admin = await User.findById(req.user.id).select("name");

        const emailSent = await deliverInvitation({
            invitation,
            token,
            invitedByName: admin?.name,
        });

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.INVITATION_RESENT,
            targetType: "Invitation",
            targetId: invitation._id,
            targetLabel: invitation.email,
            changes: {
                before,
                after: {
                    status: invitation.status,
                    expiresAt: invitation.expiresAt,
                },
            },
            metadata: { emailSent },
        });

        res.status(200).json({
            success: true,
            message: emailSent
                ? "Invitation resent successfully."
                : "Invitation renewed, but the email could not be sent. Try resending again.",
            emailSent,
            data: invitation,
        });
    } catch (error) {
        next(error);
    }
};

/*PUBLIC ENDPOINTS (the token is the credential) */

/* GET /api/invitations/:token */
const getInvitationByToken = async (req, res, next) => {
    try {
        const { invitation, error } = await getPendingInvitation(
            req.params.token
        );

        if (error) return sendInvitationError(res, error);

        await invitation.populate("invitedBy", "name");

        const accountExists = Boolean(
            await User.exists({ email: invitation.email })
        );

        res.status(200).json({
            success: true,
            data: {
                email: invitation.email,
                role: invitation.role,
                expiresAt: invitation.expiresAt,
                invitedBy: invitation.invitedBy?.name || null,
                accountExists,
            },
        });
    } catch (error) {
        next(error);
    }
};

/* POST /api/invitations/:token/accept  (new account) */
const acceptInvitation = async (req, res, next) => {
    try {
        const { invitation, error } = await getPendingInvitation(
            req.params.token
        );

        if (error) return sendInvitationError(res, error);

        const accountExistsResponse = () =>
            res.status(409).json({
                success: false,
                code: "ACCOUNT_EXISTS",
                message:
                    "An account with this email already exists. Log in and accept the invitation instead.",
            });

        if (await User.exists({ email: invitation.email })) {
            return accountExistsResponse();
        }

        const userId = new mongoose.Types.ObjectId();

        // Claim first, so two people cannot use the same invitation.
        const claimed = await claimInvitation(invitation._id, {
            status: "Accepted",
            acceptedBy: userId,
        });

        if (!claimed) {
            return res.status(410).json({
                success: false,
                message: "This invitation is no longer valid.",
            });
        }

        let user;

        try {
            user = await User.create({
                _id: userId,
                name: req.body.name,
                email: invitation.email,
                password: await hashPassword(req.body.password),
                role: invitation.role, // always from the invitation
                isVerified: true, // email ownership proven by the link
            });
        } catch (createError) {
            // Undo the claim so the invitation can be used again.
            await Invitation.updateOne(
                { _id: invitation._id },
                {
                    $set: { status: "Pending" },
                    $unset: { respondedAt: "", acceptedBy: "" },
                }
            ).catch((revertError) =>
                console.error("Could not revert invitation:", revertError.message)
            );

            if (createError.code === 11000) {
                return accountExistsResponse();
            }
            throw createError;
        }

        await logActivity({
            actor: { id: user._id.toString(), role: user.role },
            action: ACTIVITY_ACTIONS.INVITATION_ACCEPTED,
            targetType: "Invitation",
            targetId: invitation._id,
            targetLabel: invitation.email,
            metadata: { role: invitation.role, mode: "new_account" },
        });

        await notifySafely({
            recipient: claimed.invitedBy,
            type: "success",
            title: "Invitation accepted",
            message: `${invitation.email} accepted the invitation as ${invitation.role}.`,
            relatedEntity: "Invitation",
            relatedEntityId: invitation._id,
        });

        const userData = user.toObject();
        delete userData.password;

        res.status(201).json({
            success: true,
            message: "Account created. You can now log in.",
            user: userData,
        });
    } catch (error) {
        next(error);
    }
};

/* POST /api/invitations/:token/accept-existing  (logged-in existing user) */
const acceptInvitationExisting = async (req, res, next) => {
    try {
        const { invitation, error } = await getPendingInvitation(
            req.params.token
        );

        if (error) return sendInvitationError(res, error);

        const user = await User.findById(req.user.id).select(
            "email role isActive"
        );

        if (!user || user.email !== invitation.email) {
            return res.status(403).json({
                success: false,
                message:
                    "This invitation was sent to a different email address.",
            });
        }

        if (user.role !== invitation.role) {
            return res.status(403).json({
                success: false,
                message: `Your account role (${user.role}) does not match the invited role (${invitation.role}).`,
            });
        }

        const claimed = await claimInvitation(invitation._id, {
            status: "Accepted",
            acceptedBy: user._id,
        });

        if (!claimed) {
            return res.status(410).json({
                success: false,
                message: "This invitation is no longer valid.",
            });
        }

        await User.updateOne({ _id: user._id }, { isVerified: true });

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.INVITATION_ACCEPTED,
            targetType: "Invitation",
            targetId: invitation._id,
            targetLabel: invitation.email,
            metadata: { role: invitation.role, mode: "existing_account" },
        });

        await notifySafely({
            recipient: claimed.invitedBy,
            type: "success",
            title: "Invitation accepted",
            message: `${invitation.email} accepted the invitation as ${invitation.role}.`,
            relatedEntity: "Invitation",
            relatedEntityId: invitation._id,
        });

        res.status(200).json({
            success: true,
            message: "Invitation accepted.",
        });
    } catch (error) {
        next(error);
    }
};

/* POST /api/invitations/:token/reject */
const rejectInvitation = async (req, res, next) => {
    try {
        const { invitation, error } = await getPendingInvitation(
            req.params.token
        );

        if (error) return sendInvitationError(res, error);

        const claimed = await claimInvitation(invitation._id, {
            status: "Rejected",
        });

        if (!claimed) {
            return res.status(410).json({
                success: false,
                message: "This invitation is no longer valid.",
            });
        }

        await logActivity({
            actor: null,
            action: ACTIVITY_ACTIONS.INVITATION_REJECTED,
            targetType: "Invitation",
            targetId: invitation._id,
            targetLabel: invitation.email,
            message: "Rejected by the recipient.",
            metadata: { role: invitation.role },
        });

        await notifySafely({
            recipient: claimed.invitedBy,
            type: "warning",
            title: "Invitation rejected",
            message: `${invitation.email} rejected the invitation as ${invitation.role}.`,
            relatedEntity: "Invitation",
            relatedEntityId: invitation._id,
        });

        res.status(200).json({
            success: true,
            message: "Invitation rejected.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInvitation,
    listInvitations,
    resendInvitation,
    getInvitationByToken,
    acceptInvitation,
    acceptInvitationExisting,
    rejectInvitation,
};