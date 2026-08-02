const Project = require("../models/project");
const generateProjectCode = require("../utils/projectCodeGenerator");
const Inspection = require("../models/Inspection");
const InspectionImage = require("../models/InspectionImage");
const AIAnalysis = require("../models/AIAnalysis");
const CrackDetection = require("../models/CrackDetection");
const Report = require("../models/Report");

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
        const projects = await Project.find({ createdBy: req.user.id })
            .populate("createdBy", "name email role")
            .populate("assignedEngineers", "name email")
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
        const project = await Project.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        })
            .populate("createdBy", "name email role")
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
                new: true,
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