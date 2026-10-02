const Project = require("../models/project");
const generateProjectCode = require("../utils/projectCodeGenerator");
const Inspection = require("../models/inspection");
const InspectionImage = require("../models/inspectionImage");
const AIAnalysis = require("../models/AIAnalysis");
const CrackDetection = require("../models/crackDetection");
const Report = require("../models/report");

// Create Project
const createProject = async (req, res, next) => {
    try {
        const projectCode = await generateProjectCode();

        const project = await Project.create({
            ...req.body,
            projectCode,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully.",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

//Get All Projects
const getProjects = async (req, res, next) => {
    try {
        let query;

        if (req.user.role === "Engineer") {
            query = { createdBy: req.user.id };
        } else if (req.user.role === "Inspector") {
            query = { assignedInspectors: req.user.id };
        } else {
            query = {};
        }

        const projects = await Project.find(query)
            .populate("createdBy", "name email role")
            .populate("assignedEngineers", "name email")
            .populate("assignedInspectors", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        next(error);
    }
};

// Get Single Project
const getProjectById = async (req, res, next) => {
    try {
        let query = {
            _id: req.params.id,
        };

        if (req.user.role === "Engineer") {
            query.createdBy = req.user.id;
        } else if (req.user.role === "Inspector") {
            query.assignedInspectors = req.user.id;
        }

        const project = await Project.findOne(query)
            .populate("createdBy", "name email role")
            .populate("assignedInspectors", "name email role")
            .populate("assignedEngineers", "name email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

// Update Project
const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                createdBy: req.user.id
            },
            req.body,
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

// Delete Project
const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            createdBy: req.user.id,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        // Find all inspections of this project
        const inspections = await Inspection.find({
            project: project._id,
        }).select("_id");

        const inspectionIds = inspections.map(
            (inspection) => inspection._id
        );

        if (inspectionIds.length > 0) {
            // Find all AI analyses
            const analyses = await AIAnalysis.find({
                inspection: { $in: inspectionIds },
            }).select("_id");

            const analysisIds = analyses.map(
                (analysis) => analysis._id
            );

            // Delete reports
            await Report.deleteMany({
                inspection: { $in: inspectionIds },
            });

            // Delete crack detections
            await CrackDetection.deleteMany({
                analysis: { $in: analysisIds },
            });

            // Delete AI analyses
            await AIAnalysis.deleteMany({
                inspection: { $in: inspectionIds },
            });

            // Delete uploaded images
            await InspectionImage.deleteMany({
                inspection: { $in: inspectionIds },
            });

            // Delete inspections
            await Inspection.deleteMany({
                _id: { $in: inspectionIds },
            });
        }

        // Finally delete project
        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: "Project deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
};