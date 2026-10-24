const Team = require("../models/team");
const User = require("../models/user");
const Inspection = require("../models/inspection");
const InspectionImage = require("../models/inspectionImage");
const AIAnalysis = require("../models/AIAnalysis");
const CrackDetection = require("../models/crackDetection");
const Report = require("../models/report");

const { deleteImage } = require("./cloudinaryService");
const { notifySafely } = require("./invitationService");

const RUNNING_ANALYSIS_STATUSES = ["Queued", "Processing"];

/* A team can receive a project only if it is Active with an eligible lead. */
const getAssignableTeam = async (teamId) => {
    const team = await Team.findById(teamId);

    if (!team) {
        return { error: { status: 404, message: "Team not found." } };
    }

    if (team.status !== "Active") {
        return {
            error: {
                status: 409,
                message: "Only an active team can be assigned to a project.",
            },
        };
    }

    const lead = team.engineerLead
        ? await User.findById(team.engineerLead).select("role isActive")
        : null;

    if (!lead || lead.role !== "Engineer" || lead.isActive === false) {
        return {
            error: {
                status: 409,
                message: "This team has no eligible Engineer lead.",
            },
        };
    }

    return { team };
};

const getProjectInspectionIds = async (projectId) => {
    const inspections = await Inspection.find({ project: projectId })
        .select("_id")
        .lean();

    return inspections.map((inspection) => inspection._id);
};

/* True if any analysis of this project is still queued or processing. */
const hasRunningAnalysis = async (projectId) => {
    const inspectionIds = await getProjectInspectionIds(projectId);

    if (inspectionIds.length === 0) return false;

    const running = await AIAnalysis.exists({
        inspection: { $in: inspectionIds },
        status: { $in: RUNNING_ANALYSIS_STATUSES },
    });

    return Boolean(running);
};

/* How much data hangs off a project (shown before deleting). */
const getProjectFootprint = async (projectId) => {
    const inspectionIds = await getProjectInspectionIds(projectId);

    const [analyses, images, reports] = await Promise.all([
        AIAnalysis.countDocuments({ inspection: { $in: inspectionIds } }),
        InspectionImage.countDocuments({ inspection: { $in: inspectionIds } }),
        Report.countDocuments({ inspection: { $in: inspectionIds } }),
    ]);

    return {
        inspections: inspectionIds.length,
        analyses,
        images,
        reports,
    };
};

/* Notifies every active member of a team (the lead is a member too). */
const notifyTeamMembers = async (teamId, { title, message, projectId }) => {
    if (!teamId) return;

    const members = await User.find({
        team: teamId,
        isActive: { $ne: false },
    })
        .select("_id")
        .lean();

    await Promise.all(
        members.map((member) =>
            notifySafely({
                recipient: member._id,
                type: "team",
                title,
                message,
                ...(projectId && {
                    relatedEntity: "Project",
                    relatedEntityId: projectId,
                }),
            })
        )
    );
};

const deleteProjectCascade = async (project) => {
    const inspectionIds = await getProjectInspectionIds(project._id);

    const analyses = await AIAnalysis.find({
        inspection: { $in: inspectionIds },
    })
        .select("_id")
        .lean();

    const analysisIds = analyses.map((analysis) => analysis._id);

    const images = await InspectionImage.find({
        inspection: { $in: inspectionIds },
    })
        .select("publicId mediaType")
        .lean();

    const results = await Promise.allSettled(
        images.map((image) =>
            deleteImage(
                image.publicId,
                image.mediaType === "video" ? "video" : "image"
            )
        )
    );

    const failedPublicIds = images
        .filter((_, index) => results[index].status === "rejected")
        .map((image) => image.publicId);

    const reports = await Report.deleteMany({
        inspection: { $in: inspectionIds },
    });
    await CrackDetection.deleteMany({ analysis: { $in: analysisIds } });
    await AIAnalysis.deleteMany({ inspection: { $in: inspectionIds } });
    await InspectionImage.deleteMany({ inspection: { $in: inspectionIds } });
    await Inspection.deleteMany({ _id: { $in: inspectionIds } });
    await project.deleteOne();

    return {
        counts: {
            inspections: inspectionIds.length,
            analyses: analysisIds.length,
            images: images.length,
            reports: reports.deletedCount,
        },
        failedPublicIds,
    };
};

module.exports = {
    getAssignableTeam,
    hasRunningAnalysis,
    getProjectFootprint,
    notifyTeamMembers,
    deleteProjectCascade,
};