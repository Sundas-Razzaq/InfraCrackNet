const User = require("../models/user");
const Team = require("../models/team");
const Project = require("../models/project");
const Inspection = require("../models/inspection");
const InspectionImage = require("../models/inspectionImage");
const AIAnalysis = require("../models/AIAnalysis");
const Report = require("../models/report");
const Invitation = require("../models/invitation");
const ActivityLog = require("../models/activityLog");

const {
    AI_MODE,
    IS_SIMULATED_AI,
    AI_DISCLAIMER,
} = require("../utils/aiMode");

const escapeRegex = (value) =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* { fieldValue: count } */
const groupCount = async (Model, field, match = {}) => {
    const rows = await Model.aggregate([
        { $match: match },
        { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    ]);

    return rows.reduce((acc, row) => {
        acc[row._id ?? "none"] = row.count;
        return acc;
    }, {});
};

const sum = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

/* GET /api/admin/dashboard */
const getDashboard = async (req, res, next) => {
    try {
        const now = new Date();

        const [
            usersByRole,
            inactiveUsers,
            pendingInvitations,
            teamsByStatus,
            teamsWithoutLead,
            projectsByStatus,
            unassignedProjects,
            inspectionsByStatus,
            analysesByStatus,
            awaitingValidation,
            reportCount,
            recentActivity,
        ] = await Promise.all([
            groupCount(User, "role"),
            User.countDocuments({ isActive: false }),
            Invitation.countDocuments({
                status: "Pending",
                expiresAt: { $gt: now },
            }),
            groupCount(Team, "status"),
            Team.countDocuments({ engineerLead: null }),
            groupCount(Project, "status"),
            Project.countDocuments({ team: null }),
            groupCount(Inspection, "status"),
            groupCount(AIAnalysis, "status"),
            AIAnalysis.countDocuments({
                status: "Completed",
                validationStatus: "Pending",
            }),
            Report.countDocuments({}),
            ActivityLog.find({})
                .populate("actor", "name email role")
                .sort({ createdAt: -1, _id: -1 })
                .limit(5),
        ]);

        res.status(200).json({
            success: true,
            data: {
                aiMode: AI_MODE,
                aiDisclaimer: IS_SIMULATED_AI ? AI_DISCLAIMER : null,
                users: {
                    total: sum(usersByRole),
                    byRole: usersByRole,
                    inactive: inactiveUsers,
                    pendingInvitations,
                },
                teams: {
                    total: sum(teamsByStatus),
                    byStatus: teamsByStatus,
                    withoutLead: teamsWithoutLead,
                },
                projects: {
                    total: sum(projectsByStatus),
                    byStatus: projectsByStatus,
                    unassigned: unassignedProjects,
                },
                inspections: {
                    total: sum(inspectionsByStatus),
                    byStatus: inspectionsByStatus,
                },
                analyses: {
                    total: sum(analysesByStatus),
                    byStatus: analysesByStatus,
                    awaitingValidation,
                },
                reports: { total: reportCount },
                recentActivity,
            },
        });
    } catch (error) {
        next(error);
    }
};

/* GET /api/admin/inspections */
const listInspections = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            status,
            priority,
            inspectionType,
            project,
            team,
            inspector,
            from,
            to,
            sort,
        } = req.validatedQuery;

        const filter = {};

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (inspectionType) filter.inspectionType = inspectionType;
        if (inspector) filter.createdBy = inspector;

        // project / team filters -> project id list
        if (project || team) {
            const projectFilter = {};
            if (project) projectFilter._id = project;
            if (team) projectFilter.team = team;

            const projects = await Project.find(projectFilter)
                .select("_id")
                .lean();

            filter.project = { $in: projects.map((p) => p._id) };
        }

        if (search) {
            const regex = { $regex: escapeRegex(search), $options: "i" };
            filter.$or = [{ inspectionCode: regex }, { structureArea: regex }];
        }

        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = from;
            if (to) filter.createdAt.$lte = to;
        }

        const order =
            sort === "oldest"
                ? { createdAt: 1, _id: 1 }
                : { createdAt: -1, _id: -1 };

        const [inspections, total] = await Promise.all([
            Inspection.find(filter)
                .select(
                    "inspectionCode inspectionType structureArea priority status project createdBy createdAt"
                )
                .populate({
                    path: "project",
                    select: "projectCode name status team",
                    populate: { path: "team", select: "name status" },
                })
                .populate("createdBy", "name email role")
                .sort(order)
                .skip((page - 1) * limit)
                .limit(limit),
            Inspection.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: inspections,
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

/* GET /api/admin/inspections/:id */
const getInspection = async (req, res, next) => {
    try {
        const inspection = await Inspection.findById(req.params.id)
            .populate({
                path: "project",
                select: "projectCode name status priority location team",
                populate: {
                    path: "team",
                    select: "name status engineerLead",
                    populate: { path: "engineerLead", select: "name email" },
                },
            })
            .populate("createdBy", "name email role");

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
            });
        }

        const [images, analyses, reports] = await Promise.all([
            InspectionImage.find({ inspection: inspection._id })
                .select(
                    "imageUrl mediaType originalFileName fileSize uploadedBy createdAt"
                )
                .populate("uploadedBy", "name email role")
                .sort({ createdAt: -1 }),
            AIAnalysis.find({ inspection: inspection._id })
                .select(
                    "analysisCode analysisVersion status validationStatus progress averageConfidence overallSeverity riskScore startedAt completedAt validatedBy validatedAt rejectionReason createdAt"
                )
                .populate("validatedBy", "name email")
                .sort({ createdAt: -1 }),
            Report.find({ inspection: inspection._id })
                .select(
                    "reportCode version status fileName generatedBy generatedAt"
                )
                .populate("generatedBy", "name email")
                .sort({ generatedAt: -1 }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                inspection,
                images,
                analyses,
                reports,
                aiMode: AI_MODE,
                aiDisclaimer: IS_SIMULATED_AI ? AI_DISCLAIMER : null,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboard, listInspections, getInspection };