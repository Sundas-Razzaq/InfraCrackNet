const Inspection = require("../models/inspection");
const Project = require("../models/project");
const InspectionImage = require("../models/inspectionImage");
const AIAnalysis = require("../models/AIAnalysis");
const CrackDetection = require("../models/crackDetection");
const Report = require("../models/report");

const generateInspectionCode = require("../utils/inspectionCodeGenerator");
const { hasProjectAccess } = require("../utils/projectAccess");

/* HELPER: resolve accessible project IDs for the current user */

const getAccessibleProjectIds = async (user) => {
    let projectQuery;

    if (user.role === "Engineer") {
        projectQuery = { createdBy: user.id };
    } else if (user.role === "Inspector") {
        projectQuery = { assignedInspectors: user.id };
    } else {
        // Admin / other roles — no restriction
        projectQuery = {};
    }

    const projects = await Project.find(projectQuery).select("_id");

    return projects.map((project) => project._id);
};

/* Create Inspection */

const createInspection = async (req, res, next) => {
    try {
        const { project } = req.body;

        const existingProject = await Project.findById(project);

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        if (!hasProjectAccess(existingProject, req.user)) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have access to this project.",
            });
        }

        const inspectionCode =
            await generateInspectionCode();
        const inspection = await Inspection.create({
            project: existingProject._id,
            inspectionType: req.body.inspectionType,
            structureArea: req.body.structureArea,
            gpsLocation: req.body.gpsLocation,
            weather: req.body.weather,
            priority: req.body.priority,
            scheduledDate: req.body.scheduledDate,
            inspectionDate: req.body.inspectionDate,
            fieldNotes: req.body.fieldNotes,
            inspectionCode,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Inspection created successfully.",
            data: inspection,
        });
    } catch (error) {
        next(error);
    }
};

/* Get All Inspections */

const getInspections = async (req, res, next) => {
    try {
        const projectIds = await getAccessibleProjectIds(
            req.user
        );

        const inspections = await Inspection.find({
            project: { $in: projectIds },
        })
            .populate("project", "projectCode name")
            .populate("createdBy", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: inspections.length,
            data: inspections,
        });
    } catch (error) {
        next(error);
    }
};

/* Get Draft Inspections */

const getDraftInspections = async (req, res, next) => {
    try {
        const inspections = await Inspection.find({
            createdBy: req.user.id,
            status: "Draft",
        })
            .populate("project", "projectCode name")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: inspections.length,
            data: inspections,
        });
    } catch (error) {
        next(error);
    }
};

/* Get Single Inspection */

const getInspectionById = async (req, res, next) => {
    try {
        const inspection =
            await Inspection.findById(req.params.id)
                .populate("project")
                .populate("createdBy", "name email role");

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
            });
        }

        if (!hasProjectAccess(inspection.project, req.user)) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have access to this inspection.",
            });
        }

        res.status(200).json({
            success: true,
            data: inspection,
        });
    } catch (error) {
        next(error);
    }
};

/* Update Inspection — Inspector only (already enforced by route) */

const updateInspection = async (req, res, next) => {
    try {
        const updateData = {};

        const allowedFields = [
            "inspectionType",
            "structureArea",
            "gpsLocation",
            "weather",
            "priority",
            "scheduledDate",
            "inspectionDate",
            "fieldNotes",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Load first, then check access via project.
        const inspection =
            await Inspection.findById(req.params.id).populate(
                "project"
            );

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
            });
        }

        if (!hasProjectAccess(inspection.project, req.user)) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have access to this inspection.",
            });
        }

        // Optional safety: only allow editing before analysis begins.
        const editableStatuses = [
            "Draft",
            "Images Uploaded",
            "Pending Analysis",
        ];

        if (!editableStatuses.includes(inspection.status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Inspection can no longer be edited once analysis has started.",
            });
        }

        const updated =
            await Inspection.findByIdAndUpdate(
                inspection._id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

        res.status(200).json({
            success: true,
            message: "Inspection updated successfully.",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

/* Delete Inspection — Inspector only (already enforced by route) */

const deleteInspection = async (req, res, next) => {
    try {
        const inspection =
            await Inspection.findById(req.params.id).populate(
                "project"
            );

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
            });
        }

        if (!hasProjectAccess(inspection.project, req.user)) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have access to this inspection.",
            });
        }

        const deletableStatuses = [
            "Draft",
            "Images Uploaded",
            "Pending Analysis",
        ];

        if (!deletableStatuses.includes(inspection.status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Inspection cannot be deleted once analysis has started.",
            });
        }

        // Cascade delete (unchanged logic).
        const analyses = await AIAnalysis.find({
            inspection: inspection._id,
        }).select("_id");

        const analysisIds = analyses.map(
            (analysis) => analysis._id
        );

        await Report.deleteMany({
            inspection: inspection._id,
        });

        await CrackDetection.deleteMany({
            analysis: { $in: analysisIds },
        });

        await AIAnalysis.deleteMany({
            inspection: inspection._id,
        });

        await InspectionImage.deleteMany({
            inspection: inspection._id,
        });

        await inspection.deleteOne();

        res.status(200).json({
            success: true,
            message: "Inspection deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInspection,
    getInspections,
    getDraftInspections,
    getInspectionById,
    updateInspection,
    deleteInspection,
};