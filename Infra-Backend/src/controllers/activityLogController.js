const ActivityLog = require("../models/activityLog");

/* GET /api/admin/activity-log */
const getActivityLogs = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            action,
            actor,
            targetType,
            targetId,
            outcome,
            from,
            to,
        } = req.validatedQuery;

        const filter = {};

        if (action) filter.action = action;
        if (actor) filter.actor = actor;
        if (targetType) filter.targetType = targetType;
        if (targetId) filter.targetId = targetId;
        if (outcome) filter.outcome = outcome;

        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = from;
            if (to) filter.createdAt.$lte = to;
        }

        const [logs, total] = await Promise.all([
            ActivityLog.find(filter)
                .populate("actor", "name email role")
                .sort({ createdAt: -1, _id: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            ActivityLog.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: logs,
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

module.exports = {
    getActivityLogs,
};