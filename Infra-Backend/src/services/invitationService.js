const crypto = require("crypto");

const Invitation = require("../models/invitation");
const { createNotification } = require("./notificationService");
const { logActivity } = require("./activityLogService");
const { ACTIVITY_ACTIONS } = require("../utils/activityActions");

const INVITATION_EXPIRY_DAYS = 3;

const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const issueToken = (invitation) => {
    const token = crypto.randomBytes(32).toString("hex");

    invitation.tokenHash = hashToken(token);
    invitation.expiresAt = new Date(
        Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );
    invitation.lastSentAt = new Date();

    return token;
};

/* A failed notification must never break the main request. */
const notifySafely = async (payload) => {
    try {
        await createNotification(payload);
    } catch (error) {
        console.error("Notification failed:", error.message);
    }
};

const expireStaleInvitations = async () => {
    const stale = await Invitation.find({
        status: "Pending",
        expiresAt: { $lte: new Date() },
    }).select("_id");

    for (const { _id } of stale) {
        const invitation = await Invitation.findOneAndUpdate(
            {
                _id,
                status: "Pending",
                expiresAt: { $lte: new Date() },
            },
            { status: "Expired" },
            { returnDocument: "after" }
        );

        if (!invitation) continue;

        await logActivity({
            actor: null,
            action: ACTIVITY_ACTIONS.INVITATION_EXPIRED,
            targetType: "Invitation",
            targetId: invitation._id,
            targetLabel: invitation.email,
            metadata: { role: invitation.role },
        });

        await notifySafely({
            recipient: invitation.invitedBy,
            type: "warning",
            title: "Invitation expired",
            message: `The invitation sent to ${invitation.email} has expired.`,
            relatedEntity: "Invitation",
            relatedEntityId: invitation._id,
        });
    }
};

module.exports = {
    INVITATION_EXPIRY_DAYS,
    hashToken,
    issueToken,
    notifySafely,
    expireStaleInvitations,
};