const Project = require("../models/project");
const Inspection = require("../models/inspection");
const AIAnalysis = require("../models/AIAnalysis");

const OPEN_INSPECTION_STATUSES = [
    "Draft",
    "Images Uploaded",
    "Pending Analysis",
];

const RUNNING_ANALYSIS_STATUSES = ["Queued", "Processing"];

const getTeamProjects = async (teamId) =>
    Project.find({ team: teamId }).select("_id status").lean();

/*
 * Team ke projects par kitne analyses chal rahe hain.
 * inspectorId diya ho to sirf us Inspector ki banayi inspections ke.
 */
const countRunningAnalyses = async (teamId, inspectorId = null) => {
    const projects = await getTeamProjects(teamId);

    const filter = { project: { $in: projects.map((p) => p._id) } };
    if (inspectorId) filter.createdBy = inspectorId;

    const inspections = await Inspection.find(filter).select("_id").lean();

    return AIAnalysis.countDocuments({
        inspection: { $in: inspections.map((i) => i._id) },
        status: { $in: RUNNING_ANALYSIS_STATUSES },
    });
};

/* Admin ke liye: member ko hatane/badalne se kya asar padega (sirf dekhne ke liye) */
const getMemberImpact = async (team, member) => {
    const isLead = String(team.engineerLead) === String(member._id);

    const projects = await getTeamProjects(team._id);
    const openProjects = projects.filter(
        (p) => p.status !== "Completed"
    ).length;

    // Lead: team ki saari inspections. Inspector: sirf apni banayi hui.
    const inspectionFilter = { project: { $in: projects.map((p) => p._id) } };
    if (!isLead) inspectionFilter.createdBy = member._id;

    const inspections = await Inspection.find(inspectionFilter)
        .select("_id status")
        .lean();

    const inspectionIds = inspections.map((i) => i._id);
    const openInspections = inspections.filter((i) =>
        OPEN_INSPECTION_STATUSES.includes(i.status)
    ).length;

    const [runningAnalyses, awaitingValidation] = await Promise.all([
        AIAnalysis.countDocuments({
            inspection: { $in: inspectionIds },
            status: { $in: RUNNING_ANALYSIS_STATUSES },
        }),
        isLead
            ? AIAnalysis.countDocuments({
                inspection: { $in: inspectionIds },
                status: "Completed",
                validationStatus: "Pending",
            })
            : 0,
    ]);

    const blockers = [];
    const notes = [];

    if (runningAnalyses > 0) {
        blockers.push(
            `${runningAnalyses} analysis is still running. Wait for it to finish first.`
        );
    }

    if (!isLead && openInspections > 0) {
        notes.push(
            `${openInspections} open inspection(s) were created by this Inspector. After removal, other team members can view them but cannot edit them.`
        );
    }

    if (isLead && awaitingValidation > 0) {
        notes.push(
            `${awaitingValidation} completed analysis/analyses are waiting for validation. The new lead will handle them.`
        );
    }

    if (isLead && openProjects > 0) {
        notes.push(
            `${openProjects} open project(s) of this team will continue under the new lead.`
        );
    }

    return {
        action: isLead ? "replace-lead" : "remove-member",
        isLead,
        openProjects,
        openInspections,
        runningAnalyses,
        awaitingValidation,
        blockers,
        notes,
        canProceed: blockers.length === 0,
    };
};

module.exports = { countRunningAnalyses, getMemberImpact };