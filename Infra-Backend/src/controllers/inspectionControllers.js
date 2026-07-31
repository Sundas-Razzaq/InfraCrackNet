const Inspection = require("../models/inspection");
const Project = require("../models/project");
const User = require("../models/user");

const generateInspectionCode = require("../utils/inspectionCodeGenerator");

/* HELPER FUNCTION */

const validateAssignments = async (
    assignedEngineers = [],
    assignedInspectors = []
) => {
    const uniqueEngineers = [...new Set(assignedEngineers)];
    const uniqueInspectors = [...new Set(assignedInspectors)];

    if (uniqueEngineers.length > 0) {
        const engineers = await User.find({
            _id: { $in: uniqueEngineers },
            role: "Engineer",
        });

        if (engineers.length !== uniqueEngineers.length) {
            const error = new Error(
                "One or more assigned engineers are invalid."
            );

            error.statusCode = 400;

            throw error;
        }
    }

    if (uniqueInspectors.length > 0) {
        const inspectors = await User.find({
            _id: { $in: uniqueInspectors },
            role: "Inspector",
        });

        if (inspectors.length !== uniqueInspectors.length) {
            const error = new Error(
                "One or more assigned inspectors are invalid."
            );

            error.statusCode = 400;

            throw error;
        }
    }

    return {
        assignedEngineers: uniqueEngineers,
        assignedInspectors: uniqueInspectors,
    };
};

/* Create Inspection */

const createInspection = async (req, res, next) => {
    try {
        const {
            project,
            assignedEngineers = [],
            assignedInspectors = [],
        } = req.body;

        // Check if project exists
        const existingProject = await Project.findById({ _id: project, createdBy: req.user.id });

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        // Validate assignments
        const validatedAssignments =
            await validateAssignments(
                assignedEngineers,
                assignedInspectors
            );

        const inspectionCode =
            await generateInspectionCode();

        const inspection = await Inspection.create({
            ...req.body,
            inspectionCode,
            assignedEngineers:
                validatedAssignments.assignedEngineers,
            assignedInspectors:
                validatedAssignments.assignedInspectors,
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
        const inspections = await Inspection.find({ createdBy: req.user.id })
            .populate("project", "projectCode name")
            .populate("createdBy", "name email role")
            .populate(
                "assignedEngineers",
                "name email role"
            )
            .populate(
                "assignedInspectors",
                "name email role"
            )
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

/* Get Single Inspection */

const getInspectionById = async (req, res, next) => {
    try {
        const inspection =
            await Inspection.findOne({ _id: req.params.id, createdBy: req.user.id })
                .populate(
                    "project",
                    "projectCode name"
                )
                .populate(
                    "createdBy",
                    "name email role"
                )
                .populate(
                    "assignedEngineers",
                    "name email role"
                )
                .populate(
                    "assignedInspectors",
                    "name email role"
                );

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
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

/* Update Inspection */

const updateInspection = async (
    req,
    res,
    next
) => {
    try {
        // Prevent updating protected fields
        delete req.body.inspectionCode;
        delete req.body.createdBy;

        // Validate project if changed
        if (req.body.project) {
            const existingProject =
                await Project.findOne({ _id: req.body.project, createdBy: req.user.id });

            if (!existingProject) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found.",
                });
            }
        }

        // Validate assignments if changed
        if (
            req.body.assignedEngineers ||
            req.body.assignedInspectors
        ) {
            const validatedAssignments =
                await validateAssignments(
                    req.body.assignedEngineers || [],
                    req.body.assignedInspectors || []
                );

            req.body.assignedEngineers =
                validatedAssignments.assignedEngineers;

            req.body.assignedInspectors =
                validatedAssignments.assignedInspectors;
        }

        const inspection = await Inspection.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Inspection updated successfully.",
            data: inspection,
        });
    } catch (error) {
        next(error);
    }
};

/* Delete Inspection */

const deleteInspection = async (
    req,
    res,
    next
) => {
    try {
        const inspection =
            await Inspection.findOneAndDelete({
                _id: req.params.id,
                createdBy: req.user.id
            });

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Inspection deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInspection,
    getInspections,
    getInspectionById,
    updateInspection,
    deleteInspection,
};