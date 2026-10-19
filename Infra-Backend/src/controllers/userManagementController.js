const User = require("../models/user");
const Project = require("../models/project");
const Inspection = require("../models/inspection");
const AIAnalysis = require("../models/AIAnalysis");
const Report = require("../models/report");

const { logActivity } = require("../services/activityLogService");
const { ACTIVITY_ACTIONS } = require("../utils/activityActions");

const SAFE_FIELDS = "-password -resetPasswordToken -resetPasswordExpire";

const SORTS = {
    newest: { createdAt: -1, _id: -1 },
    oldest: { createdAt: 1, _id: 1 },
    name: { name: 1, _id: 1 },
};

const escapeRegex = (value) =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* Everything this user has created, been assigned, validated or generated. */
const getUserWorkload = async (userId) => {
    const [
        projectsCreated,
        projectsAssigned,
        inspections,
        analyses,
        validations,
        reports,
    ] = await Promise.all([
        Project.countDocuments({ createdBy: userId }),
        Project.countDocuments({
            $or: [
                { assignedInspectors: userId },
                { assignedEngineers: userId },
            ],
        }),
        Inspection.countDocuments({ createdBy: userId }),
        AIAnalysis.countDocuments({ createdBy: userId }),
        AIAnalysis.countDocuments({ validatedBy: userId }),
        Report.countDocuments({ generatedBy: userId }),
    ]);

    const total =
        projectsCreated +
        projectsAssigned +
        inspections +
        analyses +
        validations +
        reports;

    return {
        projectsCreated,
        projectsAssigned,
        inspections,
        analyses,
        validations,
        reports,
        total,
    };
};

/* GET /api/admin/users */
const listManagedUsers = async (req, res, next) => {
    try {
        const { page, limit, search, role, status, verified, sort } =
            req.validatedQuery;

        const filter = {};

        if (role) filter.role = role;

        // Older users have no isActive field, so "active" means "not false".
        if (status === "active") filter.isActive = { $ne: false };
        if (status === "inactive") filter.isActive = false;

        if (verified !== undefined) filter.isVerified = verified;

        if (search) {
            const regex = {
                $regex: escapeRegex(search),
                $options: "i",
            };
            filter.$or = [{ name: regex }, { email: regex }];
        }

        const [users, total] = await Promise.all([
            User.find(filter)
                .select(SAFE_FIELDS)
                .sort(SORTS[sort])
                .skip((page - 1) * limit)
                .limit(limit),
            User.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: users,
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

/* GET /api/admin/users/:id */
const getManagedUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select(SAFE_FIELDS);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const workload = await getUserWorkload(user._id);

        res.status(200).json({
            success: true,
            data: user,
            workload,
        });
    } catch (error) {
        next(error);
    }
};

/* PATCH /api/admin/users/:id/status */
const updateUserStatus = async (req, res, next) => {
    try {
        const { isActive, reason } = req.body;

        const target = await User.findById(req.params.id).select(
            "name email role isActive"
        );

        if (!target) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (target.role === "Admin") {
            return res.status(403).json({
                success: false,
                message: "The Admin account status cannot be changed.",
            });
        }

        const currentlyActive = target.isActive !== false;

        if (currentlyActive === isActive) {
            return res.status(409).json({
                success: false,
                message: `User is already ${
                    isActive ? "active" : "deactivated"
                }.`,
            });
        }

        const updated = await User.findOneAndUpdate(
            { _id: target._id, role: { $ne: "Admin" } },
            { isActive },
            { returnDocument: "after" }
        ).select(SAFE_FIELDS);

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.USER_STATUS_CHANGED,
            targetType: "User",
            targetId: target._id,
            targetLabel: target.email,
            changes: {
                before: { isActive: currentlyActive },
                after: { isActive },
            },
            message: reason || "",
            metadata: { role: target.role },
        });

        res.status(200).json({
            success: true,
            message: isActive
                ? "User activated successfully."
                : "User deactivated successfully.",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

/* PATCH /api/admin/users/:id/role */
const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        const target = await User.findById(req.params.id).select(
            "name email role"
        );

        if (!target) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (target.role === "Admin") {
            return res.status(403).json({
                success: false,
                message: "The Admin role cannot be changed.",
            });
        }

        if (target.role === role) {
            return res.status(409).json({
                success: false,
                message: `User is already an ${role}.`,
            });
        }

        const workload = await getUserWorkload(target._id);

        if (workload.total > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "This user has existing work. Role changes are only allowed for users with no projects, inspections, analyses or reports.",
                workload,
            });
        }

        // Only update if the role is still what we just read.
        const updated = await User.findOneAndUpdate(
            { _id: target._id, role: target.role },
            { role },
            { returnDocument: "after" }
        ).select(SAFE_FIELDS);

        if (!updated) {
            return res.status(409).json({
                success: false,
                message: "The user was changed by someone else. Please retry.",
            });
        }

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.USER_ROLE_CHANGED,
            targetType: "User",
            targetId: target._id,
            targetLabel: target.email,
            changes: {
                before: { role: target.role },
                after: { role },
            },
        });

        res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listManagedUsers,
    getManagedUser,
    updateUserStatus,
    updateUserRole,
};