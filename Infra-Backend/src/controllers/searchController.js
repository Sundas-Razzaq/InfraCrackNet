const Project = require("../models/project");
const Inspection = require("../models/inspection");
const AIAnalysis = require("../models/AIAnalysis");
const Report = require("../models/report");
const { getProjectScope } = require("../utils/projectAccess");

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const LIMIT_PER_GROUP = 5;

const searchAll = async (req, res, next) => {
    try {
        const q = (req.query.q || "").trim();

        if (q.length < 2) {
            return res.status(200).json({
                success: true,
                data: { projects: [], inspections: [], analyses: [], reports: [] },
            });
        }

        const regex = new RegExp(escapeRegex(q), "i");
        const scope = getProjectScope(req.user);

        // Har role ke liye: pehle accessible projects, phir un se sab kuch
        const scopedProjects = await Project.find(scope).select("_id").lean();
        const projectIds = scopedProjects.map((p) => p._id);

        const accessibleInspections = await Inspection.find({
            project: { $in: projectIds },
        })
            .select("_id")
            .lean();
        const accessibleInspectionIds = accessibleInspections.map((i) => i._id);

        const projectsPromise = Project.find({
            ...scope,
            $or: [{ projectCode: regex }, { name: regex }],
        })
            .select("_id projectCode name structureType")
            .limit(LIMIT_PER_GROUP)
            .lean();

        const inspectionsPromise = Inspection.find({
            project: { $in: projectIds },
            $or: [{ inspectionCode: regex }, { structureArea: regex }],
        })
            .select("_id inspectionCode structureArea status project")
            .populate("project", "projectCode name")
            .limit(LIMIT_PER_GROUP)
            .lean();

        const analysesPromise = AIAnalysis.find({
            inspection: { $in: accessibleInspectionIds },
            analysisCode: regex,
        })
            .select("_id analysisCode status inspection")
            .populate({
                path: "inspection",
                select: "_id inspectionCode project",
                populate: { path: "project", select: "name projectCode" },
            })
            .limit(LIMIT_PER_GROUP)
            .lean();

        const reportsPromise = Report.find({
            inspection: { $in: accessibleInspectionIds },
            $or: [{ reportCode: regex }, { fileName: regex }],
        })
            .select("_id reportCode fileName inspection")
            .populate({
                path: "inspection",
                select: "_id inspectionCode project",
                populate: { path: "project", select: "name projectCode" },
            })
            .limit(LIMIT_PER_GROUP)
            .lean();

        const [projects, inspections, analyses, reports] = await Promise.all([
            projectsPromise,
            inspectionsPromise,
            analysesPromise,
            reportsPromise,
        ]);

        return res.status(200).json({
            success: true,
            data: { projects, inspections, analyses, reports },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { searchAll };