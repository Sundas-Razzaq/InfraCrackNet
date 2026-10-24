const User = require("../models/user");
const Team = require("../models/team");
const Project = require("../models/project");
const Inspection = require("../models/inspection");
const InspectionImage = require("../models/inspectionImage");
const AIAnalysis = require("../models/AIAnalysis");
const Report = require("../models/report");
const Invitation = require("../models/invitation");
const ActivityLog = require("../models/activityLog");
const fs = require("fs");
const CrackDetection = require("../models/crackDetection");
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


/* project / team / inspection filters -> { $in: [inspectionIds] } (ya null agar koi filter nahi) */
const resolveInspectionFilter = async ({ project, team, inspection }) => {
    if (!project && !team && !inspection) return null;

    const inspectionFilter = {};

    if (project || team) {
        const projectFilter = {};
        if (project) projectFilter._id = project;
        if (team) projectFilter.team = team;

        const projects = await Project.find(projectFilter)
            .select("_id")
            .lean();

        inspectionFilter.project = { $in: projects.map((p) => p._id) };
    }

    if (inspection) inspectionFilter._id = inspection;

    const inspections = await Inspection.find(inspectionFilter)
        .select("_id")
        .lean();

    return { $in: inspections.map((i) => i._id) };
};

const INSPECTION_POPULATE = {
    path: "inspection",
    select: "inspectionCode structureArea status project",
    populate: {
        path: "project",
        select: "projectCode name team",
        populate: { path: "team", select: "name" },
    },
};
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

/* GET /api/admin/analyses */
const listAnalyses = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            status,
            validationStatus,
            severity,
            project,
            team,
            inspection,
            from,
            to,
            sort,
        } = req.validatedQuery;

        const filter = {};

        if (status) filter.status = status;
        if (validationStatus) filter.validationStatus = validationStatus;
        if (severity) filter.overallSeverity = severity;
        if (search) {
            filter.analysisCode = {
                $regex: escapeRegex(search),
                $options: "i",
            };
        }

        const inspectionFilter = await resolveInspectionFilter({
            project,
            team,
            inspection,
        });
        if (inspectionFilter) filter.inspection = inspectionFilter;

        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = from;
            if (to) filter.createdAt.$lte = to;
        }

        const order =
            sort === "oldest"
                ? { createdAt: 1, _id: 1 }
                : { createdAt: -1, _id: -1 };

        const [analyses, total] = await Promise.all([
            AIAnalysis.find(filter)
                .select(
                    "analysisCode analysisVersion status validationStatus progress totalImages processedImages averageConfidence overallSeverity riskScore startedAt completedAt validatedBy validatedAt createdBy createdAt inspection"
                )
                .populate(INSPECTION_POPULATE)
                .populate("createdBy", "name email role")
                .populate("validatedBy", "name email")
                .sort(order)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            AIAnalysis.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: analyses.map((a) => ({
                ...a,
                isSimulated: IS_SIMULATED_AI,
            })),
            aiMode: AI_MODE,
            aiDisclaimer: IS_SIMULATED_AI ? AI_DISCLAIMER : null,
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

/* GET /api/admin/analyses/:id */
const getAnalysis = async (req, res, next) => {
    try {
        const analysis = await AIAnalysis.findById(req.params.id)
            .populate(INSPECTION_POPULATE)
            .populate("createdBy", "name email role")
            .populate("validatedBy", "name email")
            .lean();

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        const [detections, reports] = await Promise.all([
            CrackDetection.find({ analysis: analysis._id })
                .select(
                    "crackId crackClass confidence severity width length area boundingBox source validationStatus reviewStatus reviewedSeverity isValidated reviewedBy reviewedAt reviewComments"
                )
                .populate("reviewedBy", "name email")
                .sort({ crackId: 1 })
                .lean(),
            Report.find({ analysis: analysis._id })
                .select("reportCode version status fileName generatedBy generatedAt")
                .populate("generatedBy", "name email")
                .sort({ generatedAt: -1 })
                .lean(),
        ]);

        const bySeverity = {};
        detections.forEach((d) => {
            const key = d.reviewedSeverity || d.severity || "none";
            bySeverity[key] = (bySeverity[key] || 0) + 1;
        });

        res.status(200).json({
            success: true,
            data: {
                analysis: { ...analysis, isSimulated: IS_SIMULATED_AI },
                detectionSummary: {
                    total: detections.length,
                    bySeverity,
                },
                detections,
                reports,
                aiMode: AI_MODE,
                aiDisclaimer: IS_SIMULATED_AI ? AI_DISCLAIMER : null,
            },
        });
    } catch (error) {
        next(error);
    }
};

/* GET /api/admin/reports */
const listReports = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            status,
            project,
            team,
            inspection,
            generatedBy,
            from,
            to,
            sort,
        } = req.validatedQuery;

        const filter = {};

        if (status) filter.status = status;
        if (generatedBy) filter.generatedBy = generatedBy;

        if (search) {
            const regex = { $regex: escapeRegex(search), $options: "i" };
            filter.$or = [{ reportCode: regex }, { fileName: regex }];
        }

        const inspectionFilter = await resolveInspectionFilter({
            project,
            team,
            inspection,
        });
        if (inspectionFilter) filter.inspection = inspectionFilter;

        if (from || to) {
            filter.generatedAt = {};
            if (from) filter.generatedAt.$gte = from;
            if (to) filter.generatedAt.$lte = to;
        }

        const order =
            sort === "oldest"
                ? { generatedAt: 1, _id: 1 }
                : { generatedAt: -1, _id: -1 };

        const [reports, total] = await Promise.all([
            Report.find(filter)
                .select(
                    "reportCode inspection analysis generatedBy version status fileName generatedAt"
                )
                .populate(INSPECTION_POPULATE)
                .populate("analysis", "analysisCode status overallSeverity")
                .populate("generatedBy", "name email role")
                .sort(order)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Report.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: reports.map((r) => ({
                ...r,
                isSimulated: IS_SIMULATED_AI,
            })),
            aiMode: AI_MODE,
            aiDisclaimer: IS_SIMULATED_AI ? AI_DISCLAIMER : null,
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

/* GET /api/admin/reports/:id */
const getReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate(INSPECTION_POPULATE)
            .populate(
                "analysis",
                "analysisCode status validationStatus overallSeverity riskScore averageConfidence"
            )
            .populate("generatedBy", "name email role")
            .lean();

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found.",
            });
        }

        // pdfData select:false hai, isliye alag se check karte hain
        const hasPdf = Boolean(
            await Report.exists({
                _id: report._id,
                pdfData: { $exists: true, $ne: null },
            })
        );

        res.status(200).json({
            success: true,
            data: {
                report: { ...report, isSimulated: IS_SIMULATED_AI },
                hasPdf,
                aiMode: AI_MODE,
                aiDisclaimer: IS_SIMULATED_AI ? AI_DISCLAIMER : null,
            },
        });
    } catch (error) {
        next(error);
    }
};

/* GET /api/admin/reports/:id/download */
const downloadReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id).select(
            "+pdfData reportCode fileName reportUrl"
        );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found.",
            });
        }

        const fileName = report.fileName || `${report.reportCode}.pdf`;

        if (report.pdfData && report.pdfData.length > 0) {
            const pdfBuffer = Buffer.from(report.pdfData);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${fileName}"`
            );
            res.setHeader("Content-Length", pdfBuffer.length);

            return res.status(200).send(pdfBuffer);
        }

        if (report.reportUrl && fs.existsSync(report.reportUrl)) {
            return res.download(report.reportUrl, fileName);
        }

        return res.status(404).json({
            success: false,
            message: "PDF file not found for this report.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard,
    listInspections,
    getInspection,
    listAnalyses,
    getAnalysis,
    listReports,
    getReport,
    downloadReport,
};