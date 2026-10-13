const Project = require("../models/project");
const Inspection = require("../models/inspection");
const AIAnalysis = require("../models/AIAnalysis");
const Report = require("../models/report");

// Escape regex special characters so user input can't break the query
const escapeRegex = (str) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const LIMIT_PER_GROUP = 5;

const searchAll = async (req, res, next) => {
    try {
        const q = (req.query.q || "").trim();

        // Empty data object shape — returned when query is too short
        const empty = {
            projects: [],
            inspections: [],
            analyses: [],
            reports: [],
        };

        if (q.length < 2) {
            return res.status(200).json({
                success: true,
                data: empty,
            });
        }

        const safe = escapeRegex(q);
        const regex = new RegExp(safe, "i");

        const user = req.user;
        const role = user.role;
        const userId = user.id;

        /*Build role-scoped filter queries*/

        // Projects the user can see
        let projectScope = {};
        if (role === "Engineer") {
            projectScope = { createdBy: userId };
        } else if (role === "Inspector") {
            projectScope = { assignedInspectors: userId };
        }

        // Inspections the user can see (by project scope OR their own)
        let inspectionScope = {};
        if (role === "Inspector") {
            inspectionScope = { createdBy: userId };
        }

        /*Projects — code + name */

        const projectsPromise = Project.find({
            ...projectScope,
            $or: [
                { projectCode: regex },
                { name: regex },
            ],
        })
            .select("_id projectCode name structureType")
            .limit(LIMIT_PER_GROUP)
            .lean();

        /*Inspections — code + structureArea*/

        let inspectionsPromise;

        if (role === "Engineer" || role === "Admin") {
            // Engineer: find projects they own, then inspections on those
            const ownedProjectIds = await Project.find(
                role === "Engineer"
                    ? { createdBy: userId }
                    : {}
            )
                .select("_id")
                .lean();

            inspectionsPromise = Inspection.find({
                project: { $in: ownedProjectIds.map((p) => p._id) },
                $or: [
                    { inspectionCode: regex },
                    { structureArea: regex },
                ],
            })
                .select(
                    "_id inspectionCode structureArea status project"
                )
                .populate("project", "projectCode name")
                .limit(LIMIT_PER_GROUP)
                .lean();
        } else {
            // Inspector: inspections they created
            inspectionsPromise = Inspection.find({
                createdBy: userId,
                $or: [
                    { inspectionCode: regex },
                    { structureArea: regex },
                ],
            })
                .select(
                    "_id inspectionCode structureArea status project"
                )
                .populate("project", "projectCode name")
                .limit(LIMIT_PER_GROUP)
                .lean();
        }

        /*Analyses — code */

        // First determine which inspections the user has access to.
        // We reuse the same logic as above, then intersect.
        let accessibleInspectionFilter;

        if (role === "Inspector") {
            accessibleInspectionFilter = { createdBy: userId };
        } else if (role === "Engineer") {
            const projectIds = await Project.find({
                createdBy: userId,
            })
                .select("_id")
                .lean();
            accessibleInspectionFilter = {
                project: { $in: projectIds.map((p) => p._id) },
            };
        } else {
            accessibleInspectionFilter = {};
        }

        const accessibleInspections = await Inspection.find(
            accessibleInspectionFilter
        )
            .select("_id")
            .lean();

        const accessibleInspectionIds = accessibleInspections.map(
            (i) => i._id
        );

        const analysesPromise = AIAnalysis.find({
            inspection: { $in: accessibleInspectionIds },
            analysisCode: regex,
        })
            .select("_id analysisCode status inspection")
            .populate({
                path: "inspection",
                select: "_id inspectionCode project",
                populate: {
                    path: "project",
                    select: "name projectCode",
                },
            })
            .limit(LIMIT_PER_GROUP)
            .lean();

        /*Reports — code + fileName*/

        const reportsPromise = Report.find({
            inspection: { $in: accessibleInspectionIds },
            $or: [
                { reportCode: regex },
                { fileName: regex },
            ],
        })
            .select("_id reportCode fileName inspection")
            .populate({
                path: "inspection",
                select: "_id inspectionCode project",
                populate: {
                    path: "project",
                    select: "name projectCode",
                },
            })
            .limit(LIMIT_PER_GROUP)
            .lean();

        /*Execute all in parallel*/

        const [
            projects,
            inspections,
            analyses,
            reports,
        ] = await Promise.all([
            projectsPromise,
            inspectionsPromise,
            analysesPromise,
            reportsPromise,
        ]);

        return res.status(200).json({
            success: true,
            data: {
                projects,
                inspections,
                analyses,
                reports,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchAll,
};