const ActivityLog = require("../models/activityLog");

const logActivity = async ({
    actor,
    action,
    targetType,
    targetId,
    targetLabel,
    changes,
    outcome = "success",
    message,
    metadata,
}) => {
    try {
        return await ActivityLog.create({
            actor: actor?.id || null,
            actorRole: actor?.role || "System",
            action,
            targetType,
            targetId: targetId || null,
            targetLabel: targetLabel || "",
            changes,
            outcome,
            message,
            metadata,
        });
    } catch (error) {
        console.error("Activity log failed:", error.message);
        return null;
    }
};

module.exports = {
    logActivity,
};